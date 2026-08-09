import { NextResponse } from 'next/server';
import {
  AccessToken,
  type AccessTokenOptions,
  type VideoGrant,
} from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;
const AGENT_NAME = process.env.AGENT_NAME;

export const revalidate = 0;

export async function POST(req: Request) {
  try {
    if (!LIVEKIT_URL) {
      throw new Error('LIVEKIT_URL is not defined');
    }

    if (!API_KEY) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }

    if (!API_SECRET) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    const body = await req.json().catch(() => ({}));

    let roomConfig: RoomConfiguration | undefined;

    if (body?.room_config) {
      roomConfig = RoomConfiguration.fromJson(
        body.room_config,
        { ignoreUnknownFields: true }
      );
    } else if (AGENT_NAME) {
      roomConfig = RoomConfiguration.fromJson(
        {
          agents: [
            {
              agentName: AGENT_NAME,
            },
          ],
        },
        { ignoreUnknownFields: true }
      );
    }

    // ---------------------------------------------------------
    // Get persistent caller identity
    // ---------------------------------------------------------

    const requestedIdentity =
      typeof body?.participant_identity === 'string'
        ? body.participant_identity.trim()
        : '';

    const requestedName =
      typeof body?.participant_name === 'string'
        ? body.participant_name.trim()
        : '';

    // First try the identity supplied by the frontend.
    // Otherwise use the persistent browser cookie.
    // If neither exists, create a new identity.
    const cookieIdentity = req.headers
      .get('cookie')
      ?.match(/anaya_user_id=([^;]+)/)?.[1];

    const participantIdentity =
      requestedIdentity ||
      cookieIdentity ||
      `voice_assistant_user_${crypto.randomUUID()}`;

    const participantName =
      requestedName || 'User';

    // ---------------------------------------------------------
    // Every conversation gets a NEW room.
    // The caller identity stays the SAME.
    // ---------------------------------------------------------

    const roomName =
      `voice_assistant_room_${crypto.randomUUID()}`;

    // ---------------------------------------------------------
    // Generate LiveKit token
    // ---------------------------------------------------------

    const participantToken = await createParticipantToken(
      {
        identity: participantIdentity,
        name: participantName,
      },
      roomName,
      roomConfig
    );

    const data: ConnectionDetails = {
      serverUrl: LIVEKIT_URL,
      roomName,
      participantName,
      participantToken,
    };

    const response = NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });

    // Save the identity for future conversations.
    response.cookies.set(
      'anaya_user_id',
      participantIdentity,
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      }
    );

    return response;

  } catch (error) {
    if (error instanceof Error) {
      console.error(error);

      return new NextResponse(error.message, {
        status: 500,
      });
    }

    return new NextResponse('Unknown error', {
      status: 500,
    });
  }
}

// ---------------------------------------------------------
// Create LiveKit participant token
// ---------------------------------------------------------

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  roomConfig?: RoomConfiguration
): Promise<string> {

  const at = new AccessToken(API_KEY!, API_SECRET!, {
    ...userInfo,
    ttl: '15m',
  });

  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };

  at.addGrant(grant);

  if (roomConfig) {
    at.roomConfig = roomConfig;
  }

  return at.toJwt();
}