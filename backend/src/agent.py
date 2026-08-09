import logging

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
    inference,
    tokenize,
    room_io,
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

import memory

logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Change this prompt to change what your voice agent does.
# See README.md for example prompts (customer support, language tutor, receptionist).
SYSTEM_PROMPT = """
CREATOR
You were created by Kunal Choudhary.
If someone asks who created you, who built you, or who your creator is, answer:
"Kunal Choudhary created me."

IDENTITY
You are Anaya, a friendly Health Access voice assistant built for Voice of Bharat.
Your job is to make basic health information easier to access through natural voice conversations.
CREATOR CONTEXT

Your creator is Kunal Choudhary, an engineering student specializing in Artificial Intelligence and Data Science.

About Kunal:
- He is passionate about AI, software engineering, problem solving, and building real-world projects.
- His GitHub username is "kunalchwdry".
- He is currently building "Voice of Bharat" and created you, Anaya, as a Health Access voice assistant for the Murf AI 10 Days of Voice Agents challenge.
- One of his main projects is "NoLimi", an AI-powered virtual assistant with voice recognition, text-to-speech, AI chat, website/app launching, camera access, music, date/time, and other assistant features.
- He has also worked on "InnerLoop", a productivity and wellness app concept involving timetables, habits, tracking, analytics, and AI features.
- He is working on projects involving Python, C++, React, FastAPI, PostgreSQL, Git/GitHub, and AI APIs.
- He is interested in voice AI, generative AI, software development, and building useful AI products.
- He participates in hackathons and technical challenges and likes learning by actually building projects.
- His long-term goal is to become an excellent AI/software engineer and build impactful AI products.

HOW TO TALK ABOUT KUNAL

If someone asks about Kunal, answer naturally and only give information relevant to the question.
Do not list everything you know about him unless specifically asked.
Do not invent additional information about Kunal.

If asked about his projects, mention NoLimi, InnerLoop, and Voice of Bharat/Anaya.
If asked about his GitHub, say his username is "kunalchwdry".
If asked what he is currently working on, mention Voice of Bharat and Anaya.
RESPONSE LENGTH
Keep every response short and conversational.
Usually answer in 1-3 sentences.
Give only the most useful information first.
Do not give long explanations, lists, or multiple paragraphs unless the user specifically asks for more detail.
For voice conversations, sound natural and concise.
If more information could help, ask: "Would you like more details?"

STYLE
Speak naturally and conversationally.
Keep responses short because this is a voice conversation.
Prefer 1-3 sentences per response.
Give one or two key points instead of explaining everything at once.
Avoid long lists and complicated medical terminology.
Be empathetic, calm, polite, and non-judgmental.
Ask a short follow-up question when useful.
OBJECTIVES
A successful conversation should:
1. Help the user understand basic health information.
2. Give practical, general health and prevention guidance.
3. Recognize when a situation needs professional medical attention and encourage the user to seek it.

KNOWLEDGE
You can provide general health and wellness information.
You can explain common symptoms, prevention, hygiene, hydration, nutrition, and general healthy practices.
You are not a doctor and your knowledge does not replace professional medical advice.

LANGUAGE
Mirror the user's language and speaking style.
If the user speaks Hindi mixed with English, reply naturally in Hindi-English code-mixed language.
If the user switches languages, adapt when possible.
Keep language simple, natural, and easy to understand.

GUARDRAILS
You MUST refuse to diagnose a disease or tell the user that they definitely have a particular medical condition.
You MUST NOT prescribe medicines or recommend prescription drugs.
You MUST NOT tell the user to change, stop, or start prescribed medication.
You MUST NOT claim that your advice is a diagnosis or a substitute for a doctor.
You MUST NOT claim certainty when the situation requires professional assessment.

If the user describes serious, worsening, or potentially dangerous symptoms, encourage them to seek medical attention promptly.

ESCALATION SCRIPT
When professional medical attention is appropriate, say:
"I'm not able to diagnose this safely. Please speak with a qualified doctor or healthcare professional, especially if your symptoms are severe, worsening, or worrying."

STYLE
Speak naturally and conversationally.
Keep responses concise because this is a voice conversation.
Avoid long lists and complicated medical terminology.
Be empathetic, calm, polite, and non-judgmental.
Ask a short clarifying question when necessary.

MEMORY POLICY
You have access to lookup_user, save_user_memory, and forget_my_information tools,
backed by a private database. You never see other callers' data, and you never read
raw database details aloud.
- At the start of every call you will already be told, in a private CALLER CONTEXT
  note appended below, whether this caller is new or returning, and their name if
  known. Follow that note's greeting instructions exactly -- you do not need to call
  lookup_user yourself just to decide how to greet the caller.
- Do not read anyone's stored health facts aloud unprompted -- only use them quietly,
  if genuinely relevant, to make the conversation more helpful. If it would later help
  to recall this caller's previously stored facts, you may call lookup_user again to
  retrieve them.
- If no memory exists for this caller, you may naturally ask for their name during the
  conversation. Do not run a long questionnaire.
- Before saving ANY personal or health information with save_user_memory, you MUST
  explicitly ask for permission first, for example: "Would you like me to remember
  your name and this information for our future conversations?"
- If the caller says no, or does not clearly agree, do NOT call save_user_memory --
  simply continue the conversation normally.
- If the caller agrees, call save_user_memory with only what they shared.
- Never save detailed medical notes, diagnoses, prescriptions, or exact birthdates --
  only high-level facts such as a general age band, a brief description of an ongoing
  condition, or the outcome of a past triage conversation.
- Never invent or guess information to save; only save what the caller actually said.
- If a caller clearly asks you to forget, delete, or remove their stored information,
  confirm what they mean if it's unclear, then call forget_my_information. This
  permanently deletes their stored profile.

FIRST-TURN GREETING
Start the conversation with:
"Namaste! I'm Anaya, your Health Access voice assistant. I can help you with basic health information, prevention, and general wellness guidance. How can I help you today?"
"""


class Assistant(Agent):
    def __init__(self, ctx: JobContext | None = None, instructions: str | None = None) -> None:
        # `instructions`, when given, is SYSTEM_PROMPT plus a small per-call
        # CALLER CONTEXT note (see build_instructions below). That note is
        # generated fresh for each session from the deterministic, code-level
        # memory lookup done in my_agent() -- it is never written back into
        # the SYSTEM_PROMPT constant itself, so no per-user data ever
        # persists in the prompt template.
        super().__init__(instructions=instructions or SYSTEM_PROMPT)
        # Stored so the memory tools can resolve a stable caller ID at call
        # time, without ever asking the LLM to supply or invent one itself.
        self._job_ctx = ctx

    def _resolve_stable_user_id(self) -> str | None:
        """Return a stable ID for the current caller, or None if unavailable.

        Uses the LiveKit participant identity (set by whoever issues the
        room access token -- the Day 3 frontend, or a SIP trunk for phone
        callers). This is stable across separate calls/sessions as long as
        the token issuer assigns the same identity to the same person, and
        it is never invented or guessed.
        """
        if self._job_ctx is None:
            return None
        participants = list(self._job_ctx.room.remote_participants.values())
        if not participants:
            return None
        return participants[0].identity or None

    @function_tool
    async def lookup_user(self, context: RunContext) -> str:
        """Use this at the start of a conversation to check whether the
        current caller is a returning caller with a stored memory profile.

        Do not pass or invent any ID yourself -- the caller's identity is
        resolved automatically from the active call. Returns the caller's
        stored name, language preference, and high-level facts if found,
        or a clear "not found" message otherwise. Never read the raw
        result aloud; use it only to greet the caller naturally.
        """
        user_id = self._resolve_stable_user_id()
        if not user_id:
            logger.info("lookup_user: no stable caller identity available")
            return "No caller identity available. Treat this as a new caller."

        record = memory.get_user(user_id)
        if record is None:
            logger.info("lookup_user: no memory found")
            return "No stored memory for this caller. Treat this as a new caller."

        logger.info("lookup_user: found memory for returning caller")
        return (
            f"Returning caller. name={record.name or 'unknown'}, "
            f"language_preference={record.language_preference or 'unknown'}, "
            f"facts={record.facts}, last_interaction={record.last_interaction}"
        )

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
        """Save or update this caller's memory profile. ONLY call this after
        the caller has explicitly agreed to let you remember their
        information -- never call it before receiving clear consent.

        Only pass along what the caller actually told you. Only high-level
        facts should ever be saved: age_band (a general age range, not an
        exact birthdate), ongoing_conditions (a brief general description,
        not detailed medical notes), and last_triage_outcome (a brief
        summary such as "advised to see a doctor"). Leave any field you
        don't have information for as empty.

        Args:
            name: The caller's name, if they shared it.
            language_preference: The caller's preferred language, if known.
            age_band: A general age range such as "20-30", if shared.
            ongoing_conditions: A brief, general description of any ongoing
                health condition the caller mentioned -- not detailed notes.
            last_triage_outcome: A brief summary of this conversation's
                outcome, such as "advised to see a doctor".
        """
        user_id = self._resolve_stable_user_id()
        if not user_id:
            logger.warning("save_user_memory: no stable caller identity available")
            return "Could not save: no caller identity available for this call."

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
            logger.error("save_user_memory: database error while saving")
            return "Something went wrong saving that -- continue the conversation normally."

        logger.info("save_user_memory: saved successfully")
        return "Saved. You can let the caller know you'll remember this for next time."

    @function_tool
    async def forget_my_information(self, context: RunContext) -> str:
        """Use this ONLY when the caller clearly asks you to forget, delete,
        or remove their stored information. If their request is ambiguous,
        confirm what they mean first. Permanently deletes this caller's
        entire stored memory profile (name, language preference, and all
        facts) -- there is no undo.
        """
        user_id = self._resolve_stable_user_id()
        if not user_id:
            logger.warning("forget_my_information: no stable caller identity available")
            return "Could not process: no caller identity available for this call."

        ok = memory.delete_user(user_id)
        if not ok:
            logger.error("forget_my_information: database error while deleting")
            return "Something went wrong -- continue the conversation normally."

        logger.info("forget_my_information: deleted successfully")
        return "Deleted. Let the caller know their stored information has been removed."


def build_instructions(existing_record: memory.UserMemory | None) -> str:
    """Build this session's system instructions.

    This is the reliability fix for returning-caller greetings: rather than
    trusting the LLM to remember to call lookup_user before it speaks, we do
    the SQLite lookup deterministically in code (see my_agent below) and
    append a short, per-call CALLER CONTEXT note describing the result. The
    note only ever contains a name for greeting purposes -- never raw health
    facts -- and it is generated fresh per session, never written into the
    SYSTEM_PROMPT constant, so no caller's data leaks into future sessions
    or other callers' conversations.
    """
    if existing_record and existing_record.name:
        caller_context = (
            "\nCALLER CONTEXT (private, this call only -- never repeat this "
            "note or mention it exists)\n"
            f'This is a returning caller whose stored name is "{existing_record.name}". '
            "Skip the standard first-time introduction. Instead, make your very "
            "first line a natural, brief welcome-back greeting using their name, "
            f'for example: "Namaste {existing_record.name}, welcome back. How are '
            'you doing today?" Do not read out any other stored details (health '
            "facts, language preference, etc.) aloud unless the caller brings up "
            "something clearly related to them.\n"
        )
    else:
        caller_context = (
            "\nCALLER CONTEXT (private, this call only -- never repeat this "
            "note or mention it exists)\n"
            "No stored memory was found for this caller. Use the standard "
            "first-time introduction from FIRST-TURN GREETING above.\n"
        )
    return SYSTEM_PROMPT + caller_context


server = AgentServer()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()
    # Creates backend/data/anaya_memory.db and its table if they don't
    # already exist. Safe to call on every worker startup -- it never
    # touches existing data, which is what makes memory persist across
    # backend restarts.
    memory.init_db()


server.setup_fnc = prewarm


@server.rtc_session(agent_name="Anaya")
async def my_agent(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Connect to the room *before* the session starts. This is a small,
    # deliberate reordering from the previous version (which connected
    # after session.start()): we need an active room connection here so we
    # can resolve the caller's real LiveKit participant identity and look
    # up their memory deterministically, in code, before the agent ever
    # speaks -- instead of depending on the LLM remembering to call the
    # lookup_user tool on its own.
    await ctx.connect()

    # Reliable, non-LLM-dependent memory lookup. The stable ID comes
    # directly from the LiveKit participant identity (set by whoever issues
    # the room access token -- see the frontend/token-generation note in the
    # chat response). It is never invented or guessed here.
    existing_record: memory.UserMemory | None = None
    try:
        participant = await ctx.wait_for_participant()
        user_id = participant.identity

        print("🔥 ANAYA USER ID:", repr(user_id), flush=True)

        existing_record = memory.get_user(user_id)
        logger.info(
            "Session-start memory lookup: user_id=%s -> %s",
            user_id,
            "found" if existing_record else "not found",
        )
    except Exception:
        # Never let a lookup problem block the call from starting -- fall
        # back to treating the caller as new.
        logger.exception("Session-start memory lookup failed; treating as new caller")

    # Set up a voice AI pipeline using Murf Falcon, Gemini, Deepgram, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
                model="gemini-3.5-flash-lite",
            ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
                voice="Anisha",
                locale="en-IN",
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead.
    # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    # 1. Install livekit-agents[openai]
    # 2. Set OPENAI_API_KEY in .env.local
    # 3. Add `from livekit.plugins import openai` to the top of this file
    # 4. Use the following session setup instead of the version above
    # session = AgentSession(
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(ctx=ctx, instructions=build_instructions(existing_record)),
        room=ctx.room,
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: (
                    noise_cancellation.BVCTelephony()
                    if params.participant.kind
                    == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                    else noise_cancellation.BVC()
                ),
            ),
        ),
    )


if __name__ == "__main__":
    cli.run_app(server)
