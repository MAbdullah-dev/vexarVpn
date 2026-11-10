export const APP_VERSION = '0.0.1';

export type ProfileControlKind = 'toggle' | 'detail';

export type ProfileControl = {
  id: string;
  kind: ProfileControlKind;
  title: string;
  persistent: boolean;
};

export const profileControls = [
  {
    id: 'autoConnect',
    kind: 'toggle',
    title: 'Auto-Connect Shield',
    persistent: true,
  },
  {
    id: 'killSwitch',
    kind: 'toggle',
    title: 'System Kill Switch',
    persistent: true,
  },
  {
    id: 'threatBlocker',
    kind: 'toggle',
    title: 'Threat & Tracker Blocker',
    persistent: true,
  },
  {
    id: 'splitTunnel',
    kind: 'detail',
    title: 'Split Tunneling',
    persistent: true,
  },
  {
    id: 'protocol',
    kind: 'detail',
    title: 'VPN Protocol',
    persistent: true,
  },
  {
    id: 'dns',
    kind: 'detail',
    title: 'Private DNS Resolver',
    persistent: true,
  },
  {
    id: 'trustedNetworks',
    kind: 'detail',
    title: 'Trusted Wi-Fi Networks',
    persistent: true,
  },
  {
    id: 'theme',
    kind: 'detail',
    title: 'App Theme',
    persistent: true,
  },
  {
    id: 'language',
    kind: 'detail',
    title: 'Language',
    persistent: true,
  },
  {
    id: 'diagnostics',
    kind: 'detail',
    title: 'Diagnostic Telemetry',
    persistent: true,
  },
  {
    id: 'help',
    kind: 'detail',
    title: 'Help & Support',
    persistent: false,
  },
  {
    id: 'about',
    kind: 'detail',
    title: 'About',
    persistent: false,
  },
  {
    id: 'subscription',
    kind: 'detail',
    title: 'Subscription',
    persistent: false,
  },
] as const satisfies readonly ProfileControl[];
