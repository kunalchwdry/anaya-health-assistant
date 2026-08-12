import asyncio
import os

import aiohttp
from dotenv import load_dotenv
from livekit.api import sip_service
from livekit.protocol import sip

load_dotenv(".env.local")


async def main():
    api_key = os.getenv("LIVEKIT_API_KEY")
    api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url = os.getenv("LIVEKIT_URL")

    print("LIVEKIT_URL:", livekit_url)
    print("API KEY:", "FOUND" if api_key else "MISSING")
    print("API SECRET:", "FOUND" if api_secret else "MISSING")

    if not api_key or not api_secret or not livekit_url:
        print("\nMissing LiveKit credentials in .env.local")
        return

    http_url = livekit_url.replace("wss://", "https://").replace("ws://", "http://")

    async with aiohttp.ClientSession() as session:
        svc = sip_service.SipService(
            session,
            http_url,
            api_key,
            api_secret,
        )

        sip.ListSIPOutboundTrunkRequest()

        result = await svc.list_outbound_trunk(
    		sip.ListSIPOutboundTrunkRequest()
	)

        print("\n=== OUTBOUND SIP TRUNKS ===")
        print(result)


if __name__ == "__main__":
    asyncio.run(main())
