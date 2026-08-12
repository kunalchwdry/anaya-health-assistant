import asyncio
import os

import aiohttp
from dotenv import load_dotenv
from livekit.api import agent_dispatch_service, sip_service

ROOM_NAME = "anaya-outbound-test"
AGENT_NAME = "Anaya"


async def make_call(destination: str):
    load_dotenv("../../../.env.local")

    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")
    trunk_id = os.getenv("LIVEKIT_SIP_OUTBOUND_TRUNK_ID")

    if not all([api_key, api_secret, livekit_url, trunk_id]):
        raise RuntimeError("Missing LiveKit configuration in .env.local")

    http_url = (
        livekit_url
        .replace("wss://", "https://")
        .replace("ws://", "http://")
    )

    async with aiohttp.ClientSession() as session:

        # 1. Create outbound SIP call
        sip_svc = sip_service.SipService(
            session,
            http_url,
            api_key,
            api_secret,
        )

        request = sip_service.CreateSIPParticipantRequest(
            sip_call_to=destination,
            room_name=ROOM_NAME,
            participant_identity="anaya-phone",
            participant_name="Anaya",
            wait_until_answered=True,
        )

        result = await sip_svc.create_sip_participant(
            request,
            trunk_id=trunk_id,
        )

        print("=== CALL CREATED ===")
        print(result)

        # 2. Dispatch Anaya to the room
        dispatch_svc = agent_dispatch_service.AgentDispatchService(
            session,
            http_url,
            api_key,
            api_secret,
        )

        dispatch_request = (
            agent_dispatch_service.CreateAgentDispatchRequest(
                agent_name=AGENT_NAME,
                room=ROOM_NAME,
                metadata="outbound-call",
            )
        )

        dispatch_result = await dispatch_svc.create_dispatch(
            dispatch_request
        )

        print("=== ANAYA DISPATCHED ===")
        print(dispatch_result)


if __name__ == "__main__":
    destination = input("Enter SIP destination: ").strip()

    if not destination:
        print("No destination provided.")
    else:
        asyncio.run(make_call(destination))
