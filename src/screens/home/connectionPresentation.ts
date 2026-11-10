import type { TabKey } from '../../components/FloatingTabBar';
import {
  DEMO_CONNECTION_NOTE,
  DEMO_SESSION_LABEL,
  type VpnConnectionState,
} from '../../types/vpn';

export type HomeToggle =
  | { type: 'ignore' }
  | { type: 'disconnect' }
  | { type: 'connect'; serverId: string }
  | { type: 'need-server' };

export type ConnectionCopy = {
  title: string;
  detail: string;
  control: string;
  accessibilityLabel: string;
};

export function connectionStatus(
  state: VpnConnectionState,
  errorMessage: string | null,
): ConnectionCopy {
  switch (state) {
    case 'disconnected':
      return {
        title: 'DEMO · DISCONNECTED',
        detail: DEMO_CONNECTION_NOTE,
        control: 'OFF',
        accessibilityLabel: `Start demo session. ${DEMO_SESSION_LABEL}. ${DEMO_CONNECTION_NOTE}`,
      };
    case 'connecting':
      return {
        title: 'DEMO · CONNECTING',
        detail: `Starting a simulated session. ${DEMO_CONNECTION_NOTE}`,
        control: 'WAIT',
        accessibilityLabel: `Connecting demo session. ${DEMO_SESSION_LABEL}.`,
      };
    case 'connected':
      return {
        title: 'DEMO · CONNECTED',
        detail: DEMO_CONNECTION_NOTE,
        control: 'ON',
        accessibilityLabel: `Stop demo session. ${DEMO_SESSION_LABEL}. ${DEMO_CONNECTION_NOTE}`,
      };
    case 'disconnecting':
      return {
        title: 'DEMO · DISCONNECTING',
        detail: `Ending the simulated session. ${DEMO_CONNECTION_NOTE}`,
        control: 'WAIT',
        accessibilityLabel: `Disconnecting demo session. ${DEMO_SESSION_LABEL}.`,
      };
    case 'failed':
      return {
        title: 'DEMO · FAILED',
        detail:
          errorMessage ??
          'The simulated session did not start. You can retry.',
        control: 'RETRY',
        accessibilityLabel: `Retry demo session. ${DEMO_SESSION_LABEL}. ${
          errorMessage ?? 'The simulated session did not start.'
        }`,
      };
  }
}

export function resolveHomeToggle(input: {
  state: VpnConnectionState;
  selectedServerId: string | null;
}): HomeToggle {
  if (input.state === 'connecting' || input.state === 'disconnecting') {
    return { type: 'ignore' };
  }
  if (input.state === 'connected') {
    return { type: 'disconnect' };
  }
  const serverId = input.selectedServerId?.trim() ?? '';
  if (!serverId) {
    return { type: 'need-server' };
  }
  return { type: 'connect', serverId };
}

export function homeHardwareBack(tab: TabKey): 'home' | 'exit' {
  return tab === 'home' ? 'exit' : 'home';
}
