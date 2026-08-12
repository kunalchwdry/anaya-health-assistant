import asyncio
import os

import aiohttp
from dotenv import load_dotenv
from livekit.api import sip_service
from livekit.protocol import sip


async def main():
    load_dotenv(".env.local")

    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")

    if not all([api_key, api_secret, livekit_url]):
        raise RuntimeError("Missing LiveKit configuration")

    http_url = livekit_url.replace("wss://", "https://").replace(
        "ws://", "http://"
    )

    async with aiohttp.ClientSession() as session:
        svc = sip_service.SipService(
            session,
            http_url,
            api_key,
            api_secret,
        )

        room_config = sip.RoomConfiguration(
            agents=[
                sip.RoomAgentDispatch(
                    agent_name="Anaya",
                    metadata="outbound SIP call",
                )
            ]
        )

        rule = sip.CreateSIPDispatchRuleRequest(
            rule=sip.SIPDispatchRule(
                dispatch_rule_individual=sip.SIPDispatchRuleIndividual(
                    room_prefix="anaya-outbound-"
                )
            ),
            name="anaya-outbound",
            room_config=room_config,
        )

        result = await svc.create_dispatch_rule(rule)

        print("=== OUTBOUND DISPATCH RULE CREATED ===")
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
