
import asyncio
import os

from dotenv import load_dotenv
from livekit.api import sip_service
from livekit.protocol import room, sip


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

    # Get the actual protobuf class from the descriptor.
    agents_field = room.RoomConfiguration.DESCRIPTOR.fields_by_name["agents"]
    RoomAgentDispatch = agents_field.message_type._concrete_class

    # Create Anaya's agent dispatch.
    agent_dispatch = RoomAgentDispatch(
        agent_name="Anaya",
        metadata="",
    )

    # IMPORTANT: agents is repeated, so it MUST be a list.
    room_config = room.RoomConfiguration(
        agents=[agent_dispatch]
    )

    # Existing dispatch rule.
    rule_id = "SDR_gKTETAENcSrd"

    # Get the existing rule first.
    async with __import__("aiohttp").ClientSession() as session:
        svc = sip_service.SipService(
            session,
            http_url,
            api_key,
            api_secret,
        )

        result = await svc.list_dispatch_rule(
            sip_service.ListSIPDispatchRuleRequest()
        )

        existing = None

        for item in result.items:
            if item.sip_dispatch_rule_id == rule_id:
                existing = item
                break

        if existing is None:
            raise RuntimeError(f"Dispatch rule {rule_id} not found")

        print("=== EXISTING RULE ===")
        print(existing)

        # Preserve the existing rule and add the room configuration.
        replace_rule = sip.SIPDispatchRuleInfo()
        replace_rule.CopyFrom(existing)
        replace_rule.room_config.CopyFrom(room_config)

        print("=== UPDATING RULE ===")

        updated = await svc.update_dispatch_rule(
            rule_id,
            replace_rule,
        )

        print("=== UPDATED ===")
        print(updated)


if __name__ == "__main__":
    asyncio.run(main())
