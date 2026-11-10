import { DEMO_BUILD_NOTE } from '../types/vpn';

export const legalCopy = {
  termsTitle: 'Terms of service',
  termsBody: `${DEMO_BUILD_NOTE} Terms of service are not published in this build. Continuing as a guest only stores a guest session on this device. No account is created, and Google sign-in cannot succeed until it is connected.`,
  privacyTitle: 'Privacy policy',
  privacyBody: `${DEMO_BUILD_NOTE} A full privacy policy is not published yet. This onboarding flow stores, on this device, whether you finished these screens, whether you continued as a guest, and your VPN permission choice. Granting Android VPN permission does not open a tunnel. A connected VPN can encrypt traffic between a device and a VPN server. It does not make you anonymous, and signing in to a site or app can still identify you to that service. This build does not claim a no-logs audit.`,
} as const;
