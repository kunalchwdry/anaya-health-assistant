import logging

from dotenv import load_dotenv
from livekit import rtc
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
    inference,
    tokenize,
    room_io,
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

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
Usually answer in 1–3 sentences.
Give only the most useful information first.
Do not give long explanations, lists, or multiple paragraphs unless the user specifically asks for more detail.
For voice conversations, sound natural and concise.
If more information could help, ask: "Would you like more details?"

STYLE
Speak naturally and conversationally.
Keep responses short because this is a voice conversation.
Prefer 1–3 sentences per response.
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

FIRST-TURN GREETING
Start the conversation with:
"Namaste! I'm Anaya, your Health Access voice assistant. I can help you with basic health information, prevention, and general wellness guidance. How can I help you today?"
"""


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=SYSTEM_PROMPT)

    # To add tools, use the @function_tool decorator.
    # Here's an example that adds a simple weather tool.
    # You also have to add `from livekit.agents import function_tool, RunContext` to the top of this file
    # @function_tool
    # async def lookup_weather(self, context: RunContext, location: str):
    #     """Use this tool to look up current weather information in the given location.
    #
    #     If the location is not supported by the weather service, the tool will indicate this. You must tell the user the location's weather is unavailable.
    #
    #     Args:
    #         location: The location to look up weather information for (e.g. city name)
    #     """
    #
    #     logger.info(f"Looking up weather for {location}")
    #
    #     return "sunny with a temperature of 70 degrees."


server = AgentServer()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


server.setup_fnc = prewarm


@server.rtc_session(agent_name="Anaya")
async def my_agent(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

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
        agent=Assistant(),
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

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(server)
