import asyncio
import os

import aiohttp
from dotenv import load_dotenv
from livekit.api import sip_service

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

        result = await svc.list_dispatch_rule(
            sip_service.ListSIPDispatchRuleRequest()
        )

        print("=== SIP DISPATCH RULES ===")
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
