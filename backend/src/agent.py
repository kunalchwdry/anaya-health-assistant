import json
import logging
from datetime import datetime, timezone

import httpx
import uuid
import sqlite3
from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    RunContext,
    cli,
    function_tool,
    room_io,
    tokenize,
)
from livekit.plugins import (
    deepgram,
    google,
    murf,
    noise_cancellation,
    silero,
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel
import memory

logger = logging.getLogger("agent")

load_dotenv(".env.local")

# ============================================================
# SYSTEM PROMPT
# ============================================================
SYSTEM_PROMPT = """
CREATOR

You were created by Kunal Choudhary.

If someone asks who created you, answer:

"Kunal Choudhary created me."

IDENTITY

You are Anaya, a friendly Health Access voice assistant built for Voice of Bharat.

Your main purpose is to make basic health information and healthcare
facility discovery easier through natural voice conversations.

RESPONSE STYLE

Keep responses short and conversational.

Usually answer in 1-3 sentences.

Be:
- friendly
- calm
- concise
- empathetic
- natural

Mirror the user's language.

If the caller speaks Hindi-English, respond naturally in Hindi-English.

HEALTH SAFETY

You can provide general health and wellness information.

You can explain:
- common symptoms
- prevention
- hygiene
- hydration
- nutrition
- general healthy practices

You are not a doctor.

Do not diagnose diseases.
Do not prescribe medicines.
Do not recommend prescription drugs.

If a situation sounds serious or dangerous, encourage the caller
to speak with a qualified healthcare professional.

DAY 5 — HEALTH FACILITY SEARCH

You have a tool called:
find_health_facilities

Use this tool when the caller asks to:
- find hospitals
- find clinics
- find health centres
- find PHCs
- find healthcare facilities
- locate hospitals nearby
- locate clinics nearby
- search healthcare facilities in a city
- search healthcare facilities in an area

If the caller does not provide a location,
ask for their city, area, or location.

IMPORTANT:

Never invent healthcare facility names.

The tool searches real OpenStreetMap data.

When results are returned:
- mention the facility names naturally
- mention that the information comes from OpenStreetMap
- mention when the data was retrieved
- do not claim that a facility is open unless the data explicitly says so
- do not claim specific services unless the data supports them
- mention that map data may be incomplete or outdated

If the lookup fails:

Do not invent facilities.

Tell the caller that the lookup is temporarily unavailable
and suggest trying again.

DATA SOURCE

Healthcare facilities are discovered using:

OpenStreetMap
Nominatim
Overpass API

The information is retrieved during the conversation.


MEMORY

You have memory tools from Day 4.

Use them when appropriate, but do not make memory the focus
of the conversation.

Never read raw database information aloud.

Only save personal information after explicit permission.


DAY 7 — HUMAN-HELP ESCALATION

You have a tool called:
create_escalation

Use it when the caller explicitly agrees to creating the escalation
request after you have provided appropriate safety guidance.

IMPORTANT:
- Never create an escalation without explicit caller consent.
- If the caller only asks for medical information, do not create one.
- For serious or potentially dangerous symptoms, first encourage immediate
  professional/emergency medical attention as appropriate.
- Then ask whether the caller wants a human-help escalation request created.
- Only after a clear yes/consent, call create_escalation.
- After the tool returns a reference ID, tell the caller the request was created
  and provide the reference ID.
- Do not claim that a human has already contacted the caller.
- Do not claim an ambulance, hospital, doctor, or emergency service was contacted.
- Keep the response short and voice-friendly.
- If an escalation already exists for the caller and the caller asks to create
  another one, avoid unnecessary duplicate requests and explain that an
  existing request is already open when the tool/data supports that conclusion.

TAKE NOTE: The user will say "continue" to indicate they are ready for you
to attempt completion


"""

# ============================================================
# ASSISTANT
# ============================================================

class Assistant(Agent):

    def __init__(
        self,
        ctx: JobContext | None = None,
        instructions: str | None = None,
    ) -> None:

        super().__init__(
            instructions=instructions or SYSTEM_PROMPT
        )

        self._job_ctx = ctx

    # ========================================================
    # RESOLVE USER ID
    # ========================================================

    def _resolve_stable_user_id(self) -> str | None:

        if self._job_ctx is None:
            return None

        participants = list(
            self._job_ctx.room.remote_participants.values()
        )

        if not participants:
            return None

        return participants[0].identity or None

    # ========================================================
    # DAY 4 — LOOKUP MEMORY
    # ========================================================

    @function_tool
    async def lookup_user(self, context: RunContext) -> str:
        user_id = self._resolve_stable_user_id()

        if not user_id:
            return "No caller identity available."

        record = memory.get_user(user_id)

        if record is None:
            return "No stored memory for this caller."

        return (
            f"Returning caller. "
            f"name={record.name or 'unknown'}, "
            f"language={record.language_preference or 'unknown'}, "
            f"facts={record.facts}"
        )

    # ========================================================
    # DAY 4 — SAVE MEMORY
    # ========================================================

    @function_tool
    async def save_user_memory(
        self,
        context: RunContext,
        name: str | None = None,
        language_preference: str | None = None,
        age_band: str | None = None,
        ongoing_conditions: str | None = None,
        last_triage_outcome: str | None = None,
    ) -> str:

        user_id = self._resolve_stable_user_id()

        if not user_id:
            return "Could not save because caller identity is unavailable."

        facts = {
            "age_band": age_band,
            "ongoing_conditions": ongoing_conditions,
            "last_triage_outcome": last_triage_outcome,
        }

        ok = memory.save_user(
            user_id=user_id,
            name=name,
            language_preference=language_preference,
            facts=facts,
        )

        if not ok:
            return "Something went wrong while saving that."

        logger.info(
            "Memory saved successfully for user=%s",
            user_id,
        )

        return "Saved successfully."

    # ========================================================
    # DAY 4 — FORGET MEMORY
    # ========================================================

    @function_tool
    async def forget_my_information(
        self,
        context: RunContext,
    ) -> str:

        user_id = self._resolve_stable_user_id()

        if not user_id:
            return "Caller identity is unavailable."

        ok = memory.delete_user(user_id)

        if not ok:
            return "Something went wrong while deleting the information."

        logger.info(
            "Memory deleted for user=%s",
            user_id,
        )

        return "Your stored information has been deleted."

    # ========================================================
    # DAY 5 — HEALTH FACILITY LOOKUP
    # ========================================================

    @function_tool
    async def find_health_facilities(
        self,
        context: RunContext,
        location: str,
    ) -> str:

        """

        DAY 5 FLOW:

        1. Geocode location with Nominatim.
        2. Query OpenStreetMap through Overpass.
        3. Extract hospital and clinic names.
        4. Remove duplicates.
        5. Return a short voice-friendly response.
        """

        # ----------------------------------------------------
        # VALIDATE LOCATION
        # ----------------------------------------------------

        if not location or not location.strip():

            return (
                "Please tell me your city or area "
                "so I can search for nearby health facilities."
            )

        location = location.strip()

        logger.info(
            "DAY 5 health facility lookup: %s",
            location,
        )

        try:

            # ---------------------------------------------===
            # HTTP CLIENT
            # ---------------------------------------------===

            async with httpx.AsyncClient(
                timeout=httpx.Timeout(
                    connect=8.0,
                    read=15.0,
                    write=15.0,
                    pool=8.0,
                ),
                follow_redirects=True,
            ) as client:

                # =============================================
                # 1. GEOCODING
                # =============================================

                logger.info(
                    "DAY 5: geocoding location=%s",
                    location,
                )

                geo_response = await client.get(
                    "https://nominatim.openstreetmap.org/search",
                    params={
                        "q": location,
                        "format": "jsonv2",
                        "limit": 1,
                    },
                    headers={
                        "User-Agent":
                            "Anaya-Health-Access-Demo/1.0"
                    },
                )

                geo_response.raise_for_status()

                geo_response.json()

                locations = geo_response.json()

                if not locations:

                    logger.warning(
                        "DAY 5: location not found: %s",
                        location,
                    )

                    return (
                        f"I couldn't find {location} "
                        "in the map data. "
                        "Please try a nearby city or area."
                    )

                latitude = float(
                    locations[0]["lat"]
                )

                longitude = float(
                    locations[0]["lon"]
                )

                logger.info(
                    "Geocoded %s -> %s, %s",
                    location,
                    latitude,
                    longitude,
                )

                # =============================================
                # 2. BUILD OVERPASS QUERY
                # =============================================

                overpass_query = f"""
[out:json][timeout:15];
(
  nwr["amenity"="hospital"](around:5000,{latitude},{longitude});
  nwr["amenity"="clinic"](around:5000,{latitude},{longitude});
  nwr["amenity"="doctors"](around:5000,{latitude},{longitude});
);
out center tags;
"""

                logger.info(
                    "DAY 5: querying Overpass"
                )

                # =============================================
                # 3. TRY MULTIPLE OVERPASS SERVERS
                # =============================================

                overpass_endpoints = [
                    "https://overpass.private.coffee/api/interpreter",
                    "https://overpass.kumi.systems/api/interpreter",
                    "https://overpass-api.de/api/interpreter",
                ]

                data = None

                for endpoint in overpass_endpoints:

                    try:

                        logger.info(
                            "DAY 5: trying Overpass endpoint=%s",
                            endpoint,
                        )

                        osm_response = await client.post(
                            endpoint,
                            content=overpass_query,
                            headers={
                                "User-Agent":
                                    "Anaya-Health-Access-Demo/1.0",
                                "Content-Type":
                                    "text/plain",
                            },
                        )

                        osm_response.raise_for_status()

                        data = osm_response.json()

                        logger.info(
                            "DAY 5: Overpass success endpoint=%s",
                            endpoint,
                        )

                        break

                    except httpx.TimeoutException:

                        logger.warning(
                            "DAY 5: Overpass timeout endpoint=%s",
                            endpoint,
                        )

                        continue

                    except httpx.HTTPStatusError as error:

                        logger.warning(
                            "DAY 5: Overpass HTTP error endpoint=%s status=%s",
                            endpoint,
                            error.response.status_code,
                        )

                        continue

                    except httpx.RequestError as error:

                        logger.warning(
                            "DAY 5: Overpass network error endpoint=%s error=%s",
                            endpoint,
                            error,
                        )

                        continue

                # =============================================
                # 4. ALL OVERPASS SERVERS FAILED
                # =============================================

                if data is None:

                    logger.warning(
                        "DAY 5: all Overpass endpoints failed"
                    )

                    return (
                        "The health facility lookup is temporarily "
                        "unavailable right now. "
                        "Please try again in a little while."
                    )

            # =============================================
            # 5. EXTRACT FACILITIES
            # =============================================

            facilities = []

            for element in data.get(
                "elements",
                [],
            ):

                tags = element.get(
                    "tags",
                    {},
                )

                name = tags.get("name")

                if not name:
                    continue

                facility_type = tags.get(
                    "amenity",
                    "health facility",
                )

                facilities.append(
                    {
                        "name": name.strip(),
                        "type": facility_type,
                    }
                )

            logger.info(
                "DAY 5: raw facilities found=%d",
                len(facilities),
            )

            # =============================================
            # 6. REMOVE DUPLICATES
            # =============================================

            unique_facilities = []

            seen = set()

            for facility in facilities:

                key = facility["name"].lower()

                if key in seen:
                    continue

                seen.add(key)

                unique_facilities.append(
                    facility
                )

            # =============================================
            # 7. LIMIT RESULTS FOR VOICE
            # =============================================

            unique_facilities = unique_facilities[:5]

            logger.info(
                "DAY 5: unique facilities returned=%d",
                len(unique_facilities),
            )

            # =============================================
            # 8. NO RESULTS
            # =============================================

            if not unique_facilities:

                return (
                    f"I couldn't find mapped hospitals or clinics "
                    f"near {location}. "
                    "The OpenStreetMap data may be incomplete."
                )

            # =============================================
            # 9. BUILD VOICE RESPONSE
            # =============================================

            facility_text = "; ".join(
                f"{facility['name']} "
                f"({facility['type']})"
                for facility in unique_facilities
            )

            retrieved_at = datetime.now(
                timezone.utc
            ).strftime(
                "%d %B %Y at %H:%M UTC"
            )

            logger.info(
                "DAY 5: successful lookup for %s",
                location,
            )

            return (
                f"I found {len(unique_facilities)} mapped "
                f"health facilities near {location}: "
                f"{facility_text}. "
                f"This information comes from OpenStreetMap "
                f"and was retrieved on {retrieved_at}. "
                "The map data may be incomplete or outdated."
            )

        # ====================================================
        # FAILURE HANDLING
        # ====================================================

        except httpx.TimeoutException:

            logger.warning(
                "DAY 5 lookup timed out"
            )

            return (
                "The health facility lookup is taking "
                "too long right now. "
                "Please try again in a moment."
            )

        except httpx.HTTPStatusError as error:

            logger.error(
                "DAY 5 HTTP error: %s",
                error,
            )

            return (
                "I couldn't access the health facility "
                "data right now. "
                "Please try again later."
            )

        except httpx.RequestError as error:

            logger.error(
                "DAY 5 network error: %s",
                error,
            )

            return (
                "I'm having trouble connecting to the "
                "health facility data right now. "
                "Please try again later."
            )

        except Exception:
            logger.exception(
                "DAY 5 unexpected lookup error"
            )

            return (
                "Something went wrong while searching "
                "for health facilities. "
                "I don't want to guess, so please "
                "try the search again."
            )


# ============================================================
# PRIVATE CALLER CONTEXT
# ============================================================

def build_instructions(
    existing_record: memory.UserMemory | None,
) -> str:

    if existing_record:

        name = existing_record.name or "there"

        facts = existing_record.facts or {}

        useful_facts = []

        for key, value in facts.items():

            if value:
                useful_facts.append(
                    f"- {key}: {value}"
                )

        facts_text = "\n".join(
            useful_facts
        )

        caller_context = (
            "\n\n"
            "CALLER CONTEXT — PRIVATE\n"
            "Never mention the database or memory tools.\n\n"
            f"Caller name: {name}\n"
        )

        if facts_text:

            caller_context += (
                "Previously saved high-level facts:\n"
                f"{facts_text}\n"
            )

        caller_context += (
            "\nRETURNING CALLER:\n"
            f"- Greet the caller naturally by name: {name}.\n"
            "- Do not list everything you remember.\n"
            "- Use stored information only when relevant.\n"
            "- Never invent stored information.\n"
        )

    else:

        caller_context = (
            "\n\n"
            "CALLER CONTEXT — PRIVATE\n"
            "No stored memory was found.\n"
            "Treat this as a new caller.\n"
            "Start naturally with a brief greeting.\n"
        )

    return SYSTEM_PROMPT + caller_context


# ============================================================
# SERVER
# ============================================================

server = AgentServer()

# ============================================================
# PREWARM
# ============================================================

def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()
    memory.init_db()
    memory.init_escalations_db()
    logger.info(
        "Memory and escalation databases initialized"
    )

server.setup_fnc = prewarm


# ============================================================
# AGENT SESSION
# ============================================================

@server.rtc_session(
    agent_name="Anaya"
)
async def my_agent(
    ctx: JobContext,
):
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # --------------------------------------------------------
    # CONNECT TO LIVEKIT
    # --------------------------------------------------------

    await ctx.connect()

    # --------------------------------------------------------
    # DAY 4 — SESSION MEMORY
    # ========================================================
    existing_record: memory.UserMemory | None = None

    try:
        participant = await ctx.wait_for_participant()

        user_id = participant.identity

        print(
            "🔥 ANAYA USER ID:",
            repr(user_id),
            flush=True,
        )

        existing_record = memory.get_user(
            user_id
        )

        logger.info(
            "Session-start memory lookup: "
            "user_id=%s -> %s",
            user_id,
            "found"
            if existing_record
            else "not found",
        )

    except Exception:
        logger.exception(
            "Session-start memory lookup failed"
        )

    # --------------------------------------------------------
    # VOICE PIPELINE
    # --------------------------------------------------------

    session = AgentSession(
        stt=deepgram.STT(
            model="nova-3",
        ),
        llm=google.LLM(
            model="gemini-3.5-flash-lite",
        ),
        tts=murf.TTS(
            voice="Anisha",
            locale="en-IN",
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(
                min_sentence_len=2
            ),
            text_pacing=True,
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    # --------------------------------------------------------
    # DAY 8 — CALL ANALYTICS
    # --------------------------------------------------------
    call_id = uuid.uuid4().hex
    started_at = datetime.now(timezone.utc)
    channel = "browser"
    success_flag = 0
    analytics_recorded = False

    def record_analytics(
        ended_at: datetime,
        *,
        success: int,
        failure_reason: str | None = None,
    ) -> None:
        """Record exactly one analytics row for this LiveKit session."""
        nonlocal analytics_recorded

        if analytics_recorded:
            logger.info(
                "Analytics already recorded for call %s, skipping",
                call_id,
            )
            return

        db_path = r"D:\Projects\murf-livekit-starter\call_analytics_dashboard\calls.db"

        try:
            with sqlite3.connect(db_path) as conn:
                conn.execute(
                    """
                    INSERT OR IGNORE INTO calls (
                        call_id,
                        started_at,
                        ended_at,
                        duration_seconds,
                        channel,
                        success,
                        failure_reason
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        call_id,
                        started_at.isoformat(),
                        ended_at.isoformat(),
                        (ended_at - started_at).total_seconds(),
                        channel,
                        int(success),
                        failure_reason,
                    ),
                )
                conn.commit()

            analytics_recorded = True
            logger.info(
                "Analytics recorded: call_id=%s success=%s",
                call_id,
                success,
            )
        except Exception:
            logger.exception(
                "Failed to save call analytics for call_id=%s",
                call_id,
            )

    @session.on("close")
    def _on_session_close(ev) -> None:
        """Finalize analytics when the AgentSession closes."""
        ended_at = datetime.now(timezone.utc)

        reason = getattr(ev, "reason", None)
        reason_value = getattr(reason, "value", str(reason)).lower()

        # For Day 8, treat a normal session termination as successful.
        # Explicit error/failed reasons are recorded as failures.
        failure_reasons = {
            "error",
            "failed",
            "internal_error",
            "server_error",
            "timeout",
            "assignment_timeout",
            "cancelled",
        }

        if reason_value in failure_reasons:
            success = 0
            failure_reason = reason_value
        else:
            success = 1
            failure_reason = None

        record_analytics(
            ended_at,
            success=success,
            failure_reason=failure_reason,
        )

    # ============================================================
    # START SESSION — EXACTLY ONCE
    # ============================================================

    await session.start(
        agent=Assistant(
            ctx=ctx,
            instructions=build_instructions(
                existing_record
            ),
        ),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: (
                    noise_cancellation.BVCTelephony()
                    if (
                        params.participant.kind
                        == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                    )
                    else noise_cancellation.BVC()
                ),
            ),
        ),
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    cli.run_app(server)