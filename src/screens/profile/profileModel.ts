import { APP_VERSION } from '../../constants/profile';
import { googleSignIn } from '../../services/auth/googleSignIn';
import type {
  DiagnosticTelemetry,
  DnsPreference,
  LanguagePreference,
  ProfileSettings,
  ProtocolPreference,
  ThemePreference,
} from '../../types/profile';
import type { SessionStatus } from '../../types/session';

export type ProfileDetail =
  | 'split'
  | 'protocol'
  | 'dns'
  | 'trusted'
  | 'theme'
  | 'language'
  | 'diagnostics';

export type LocalNameResult = 'added' | 'empty' | 'duplicate' | 'full';

export type Choice<T extends string> = {
  id: T;
  title: string;
  subtitle: string;
};

export const LOCAL_LIST_LIMIT = 8;

export const HELP_NOTICE = 'Help is not available in this build.';
export const ABOUT_NOTICE = `VEXRAVPN ${APP_VERSION}. This demo build has no published support page or legal URL.`;
export const NOTIFICATIONS_NOTICE =
  'Notifications are not available in this stage.';
export const PROFILE_HERE_NOTICE = 'Profile settings are on this screen.';

export const protocolIntro =
  'Choosing a protocol saves a preference. It does not start or change a demo session.';
export const dnsIntro =
  'This is a saved app preference. It does not change the device DNS configuration.';
export const trustedIntro =
  'Local names only. This build does not detect Wi-Fi or change the VPN session.';
export const splitIntro =
  'Saved app names only. This build does not bypass traffic for any app.';

export const protocolChoices: readonly Choice<ProtocolPreference>[] = [
  {
    id: 'wireguard',
    title: 'WireGuard',
    subtitle:
      'UDP. Saved preference. This build does not start a WireGuard tunnel.',
  },
];

export const dnsChoices: readonly Choice<DnsPreference>[] = [
  {
    id: 'cloudflare',
    title: 'Cloudflare 1.1.1.1',
    subtitle:
      'Saved app preference. This build does not change the device DNS configuration.',
  },
];

export const themeChoices: readonly Choice<ThemePreference>[] = [
  {
    id: 'obsidian-dark',
    title: 'Obsidian Dark',
    subtitle: 'The only theme in this build. It is already active.',
  },
];

export const languageChoices: readonly Choice<LanguagePreference>[] = [
  {
    id: 'en-US',
    title: 'English (United States)',
    subtitle: 'The only language in this build.',
  },
];

export const diagnosticChoices: readonly Choice<DiagnosticTelemetry>[] = [
  {
    id: 'client-side',
    title: 'On this device',
    subtitle:
      'Saved with app settings. This control does not upload diagnostics.',
  },
];

export const defenseCopy = {
  autoConnect: {
    title: 'Auto-Connect Shield',
    subtitle:
      'Saved preference. This build does not detect Wi-Fi or start a session.',
    notice:
      'Auto-connect is saved on this device. This build does not detect Wi-Fi or start a session.',
  },
  killSwitch: {
    title: 'System Kill Switch',
    subtitle: 'Saved preference. This build does not drop internet traffic.',
    notice:
      'Kill switch is saved on this device. This build does not drop internet traffic.',
  },
  threatBlocker: {
    title: 'Threat & Tracker Blocker',
    subtitle:
      'Saved preference. This build does not block hostnames or trackers.',
    notice:
      'Threat blocker is saved on this device. This build does not block hostnames or trackers.',
  },
} as const;

export function accountPresentation(status: SessionStatus) {
  const guest = status === 'guest';
  return {
    name: guest ? 'Guest' : 'Signed out',
    badge: guest ? 'GUEST' : 'SIGNED OUT',
    summary: guest
      ? 'Guest mode. No account is signed in.'
      : 'No account is signed in.',
    signIn: googleSignIn.reason,
    sessionValue: guest ? 'Guest' : 'Signed out',
  };
}

export function logoutCopy(status: SessionStatus) {
  return {
    label: 'Log out',
    accessibilityLabel:
      status === 'guest'
        ? 'Log out of the guest session'
        : 'Log out. No account is signed in.',
    caption:
      'Ends this session on the device. Onboarding, VPN permission, selected server, favorites, and saved preferences stay.',
  };
}

export function savedCount(count: number): string {
  return `${count} saved`;
}

export function listSubtitle(names: readonly string[], empty: string): string {
  return names.length > 0 ? names.join(', ') : empty;
}

export function profileBackAction(
  detailOpen: boolean,
): 'profile' | 'previous' {
  return detailOpen ? 'profile' : 'previous';
}

export function addLocalName(
  names: readonly string[],
  raw: string,
  limit = LOCAL_LIST_LIMIT,
): { names: string[]; result: LocalNameResult } {
  const name = raw.trim();
  if (!name) {
    return { names: [...names], result: 'empty' };
  }
  if (names.some(item => item.toLowerCase() === name.toLowerCase())) {
    return { names: [...names], result: 'duplicate' };
  }
  if (names.length >= limit) {
    return { names: [...names], result: 'full' };
  }
  return { names: [name, ...names], result: 'added' };
}

export function removeLocalName(
  names: readonly string[],
  name: string,
): string[] {
  return names.filter(item => item !== name);
}

export function localNameNotice(
  result: LocalNameResult,
  kind: 'network' | 'app',
): string | null {
  if (result === 'added') {
    return null;
  }
  if (result === 'empty') {
    return `Enter a ${kind} name.`;
  }
  if (result === 'duplicate') {
    return 'That name is already saved.';
  }
  return `This list holds ${LOCAL_LIST_LIMIT} names.`;
}

export function protocolLabel(settings: ProfileSettings): string {
  return (
    protocolChoices.find(item => item.id === settings.protocol)?.title ??
    'WireGuard'
  );
}

export function dnsLabel(settings: ProfileSettings): string {
  return (
    dnsChoices.find(item => item.id === settings.dnsResolver)?.title ??
    'Cloudflare 1.1.1.1'
  );
}

export function themeLabel(settings: ProfileSettings): string {
  return (
    themeChoices.find(item => item.id === settings.theme)?.title ??
    'Obsidian Dark'
  );
}

export function languageLabel(settings: ProfileSettings): string {
  return (
    languageChoices.find(item => item.id === settings.language)?.title ??
    'English (United States)'
  );
}
