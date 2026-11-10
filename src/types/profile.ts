export type ThemePreference = 'obsidian-dark';
export type LanguagePreference = 'en-US';
export type DiagnosticTelemetry = 'client-side';
export type ProtocolPreference = 'wireguard';
export type DnsPreference = 'cloudflare';

export type ProfileSettings = {
  autoConnect: boolean;
  killSwitch: boolean;
  threatBlocker: boolean;
  splitTunnelAppIds: string[];
  protocol: ProtocolPreference;
  dnsResolver: DnsPreference;
  trustedNetworkNames: string[];
  theme: ThemePreference;
  language: LanguagePreference;
  diagnosticTelemetry: DiagnosticTelemetry;
};

export const defaultProfileSettings: ProfileSettings = {
  autoConnect: false,
  killSwitch: false,
  threatBlocker: false,
  splitTunnelAppIds: [],
  protocol: 'wireguard',
  dnsResolver: 'cloudflare',
  trustedNetworkNames: [],
  theme: 'obsidian-dark',
  language: 'en-US',
  diagnosticTelemetry: 'client-side',
};
