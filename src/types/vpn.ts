export type VpnConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'failed';

export type VpnPermissionStatus =
  | 'unknown'
  | 'deferred'
  | 'granted'
  | 'denied';

export const DEMO_SESSION_LABEL = 'Demo session';

export const DEMO_CONNECTION_NOTE =
  'Simulated connection. This is not a protected VPN tunnel.';

export const DEMO_BUILD_NOTE =
  'This demo does not protect your traffic or open a VPN tunnel.';

export type VpnSession = {
  state: VpnConnectionState;
  simulated: true;
  demoLabel: typeof DEMO_SESSION_LABEL;
  serverId: string | null;
  connectedAt: number | null;
  errorMessage: string | null;
};
