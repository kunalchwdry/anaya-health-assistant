export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorDark?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerBarCount?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerWaveLineWidth?: number;

  // agent dispatch configuration
  agentName?: string;

  // LiveKit Cloud Sandbox configuration
  sandboxId?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Anaya',
  pageTitle: 'Anaya — Voice of Bharat',
  pageDescription:
    'Your voice-first AI health-access companion. Speak naturally in 10+ Indian languages.',

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/anaya-logo.svg',
  accent: '#37d4d0',
  logoDark: '/anaya-logo-dark.svg',
  accentDark: '#37d4d0',
  startButtonText: 'Talk to Anaya',

  // audio visualization configuration
  audioVisualizerType: 'aura',
  audioVisualizerColor: '#37d4d0',
  audioVisualizerColorDark: '#37d4d0',
  audioVisualizerColorShift: 0.2,
  audioVisualizerRadialBarCount: 25,
  audioVisualizerRadialRadius: 100,

  // agent dispatch configuration
  agentName: 'Anaya',

  // LiveKit Cloud Sandbox configuration
  sandboxId: undefined,
};
