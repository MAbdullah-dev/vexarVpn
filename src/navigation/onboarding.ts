import type { NavigationProp } from '@react-navigation/native';

import { useAppStore } from '../store';
import type { RootStackParamList } from './types';

export const freshOnboardingFlow = [
  'Splash',
  'Welcome',
  'WhyVpn',
  'Privacy',
  'VpnPermission',
] as const;

export type OnboardingRoute = (typeof freshOnboardingFlow)[number];

export function routeAfterSplash(
  onboardingCompleted: boolean,
): 'Welcome' | 'Home' {
  return onboardingCompleted ? 'Home' : 'Welcome';
}

/** Splash replaces itself, so Android Back never returns to it. */
export function onboardingBackTarget(
  route: OnboardingRoute,
): OnboardingRoute | null {
  switch (route) {
    case 'WhyVpn':
      return 'Welcome';
    case 'Privacy':
      return 'WhyVpn';
    case 'VpnPermission':
      return 'Privacy';
    case 'Splash':
    case 'Welcome':
      return null;
  }
}

export function openMainApp(
  navigation: NavigationProp<RootStackParamList>,
): void {
  useAppStore.getState().completeOnboarding();
  navigation.reset({
    index: 0,
    routes: [{ name: 'Home' }],
  });
}

export function deferPermissionAndEnter(
  navigation: NavigationProp<RootStackParamList>,
): void {
  useAppStore.getState().setVpnPermission('deferred');
  openMainApp(navigation);
}
