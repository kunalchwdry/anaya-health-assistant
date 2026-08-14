'use client';

import { useMemo } from 'react';
import { TokenSource } from 'livekit-client';
import { useSession } from '@livekit/components-react';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import type { AppConfig } from '@/app-config';
import { AgentSessionProvider } from '@/components/agents-ui/agent-session-provider';
import { StartAudioButton } from '@/components/agents-ui/start-audio-button';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/ui/sonner';
import { useAgentErrors } from '@/hooks/useAgentErrors';
import { useDebugMode } from '@/hooks/useDebug';
import { getSandboxTokenSource } from '@/lib/utils';

const IN_DEVELOPMENT = process.env.NODE_ENV !== 'production';

function AppSetup() {
  useDebugMode({ enabled: IN_DEVELOPMENT });
  useAgentErrors();

  return null;
}

interface AppProps {
  appConfig: AppConfig;
}

function getPersistentIdentity(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const key = 'anaya_user_identity';
  let identity = window.localStorage.getItem(key);

  if (!identity) {
    identity = `voice_assistant_user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    window.localStorage.setItem(key, identity);
  }

  return identity;
}
export function App({ appConfig }: AppProps) {
  const tokenSource = useMemo(() => {
    if (typeof process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT === 'string') {
      return getSandboxTokenSource(appConfig);
    }

    return TokenSource.endpoint('/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // @ts-expect-error - body is required for our custom endpoint
      body: JSON.stringify({
        participant_identity:
          typeof window !== 'undefined'
            ? (() => {
                const key = 'anaya_user_identity';
                let identity = window.localStorage.getItem(key);

                if (!identity) {
                  identity = `voice_assistant_user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
                  window.localStorage.setItem(key, identity);
                }

                return identity;
              })()
            : undefined,
      }),
    });
  }, [appConfig]);

  const session = useSession(
    tokenSource,
    appConfig.agentName ? { agentName: appConfig.agentName } : undefined
  );

  return (
    <AgentSessionProvider session={session}>
      <AppSetup />
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController appConfig={appConfig} />
      </main>
      <StartAudioButton label="Start Audio" />
      <Toaster
        icons={{
          warning: <WarningIcon weight="bold" />,
        }}
        position="top-center"
        className="toaster group"
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
      />
    </AgentSessionProvider>
  );
}
