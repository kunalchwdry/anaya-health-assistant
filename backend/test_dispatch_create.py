import os
import asyncio
import aiohttp
from dotenv import load_dotenv
from livekit.api import sip_service
from livekit.protocol import sip

load_dotenv(".env.local")


async def main():
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")

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

        request = sip_service.CreateSIPDispatchRuleRequest(
            rule=sip.SIPDispatchRule(
                dispatch_rule_individual=sip.SIPDispatchRuleIndividual(
                    room_prefix="anaya-inbound-"
                )
            ),
            name="anaya-inbound",
        )

        result = await svc.create_sip_dispatch_rule(request)

        print("=== DISPATCH RULE CREATED ===")
        print(result)


if __name__ == "__main__":
    asyncio.run(main())