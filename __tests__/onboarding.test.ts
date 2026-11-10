import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

import { STORAGE_KEYS } from '../src/constants/storage';
import { googleSignIn } from '../src/services/auth/googleSignIn';
import { SimulatedVpnService } from '../src/services/vpn';
import {
  interpretVpnPrepareResult,
  requestAndroidVpnPermission,
} from '../src/services/vpn/vpnPermission';
import {
  deferPermissionAndEnter,
  freshOnboardingFlow,
  onboardingBackTarget,
  openMainApp,
  routeAfterSplash,
} from '../src/navigation/onboarding';
import { resetAppStore, useAppStore } from '../src/store';

async function flushPersistence(): Promise<void> {
  await new Promise<void>(resolve => {
    setImmediate(() => resolve());
  });
}

describe('onboarding flow', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetAppStore();
  });

  it('sends a first launch to welcome and a completed launch to the main app', () => {
    expect(freshOnboardingFlow).toEqual([
      'Splash',
      'Welcome',
      'WhyVpn',
      'Privacy',
      'VpnPermission',
    ]);
    expect(routeAfterSplash(false)).toBe('Welcome');
    expect(routeAfterSplash(true)).toBe('Home');
  });

  it('sends Android Back to the previous onboarding screen and never to splash', () => {
    expect(onboardingBackTarget('Splash')).toBeNull();
    expect(onboardingBackTarget('Welcome')).toBeNull();
    expect(onboardingBackTarget('WhyVpn')).toBe('Welcome');
    expect(onboardingBackTarget('Privacy')).toBe('WhyVpn');
    expect(onboardingBackTarget('VpnPermission')).toBe('Privacy');
  });

  it('keeps guest entry separate from onboarding completion', () => {
    useAppStore.getState().continueAsGuest();
    expect(useAppStore.getState().sessionStatus).toBe('guest');
    expect(useAppStore.getState().onboardingCompleted).toBe(false);
  });

  it('finishes onboarding without creating a vpn session', () => {
    const navigation = { reset: jest.fn() };
    openMainApp(navigation as never);

    expect(useAppStore.getState().onboardingCompleted).toBe(true);
    expect(new SimulatedVpnService().getSession().state).toBe('disconnected');
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  });

  it('defers vpn permission without connecting or clearing onboarding', () => {
    const navigation = { reset: jest.fn() };
    deferPermissionAndEnter(navigation as never);

    const state = useAppStore.getState();
    expect(state.vpnPermission).toBe('deferred');
    expect(state.onboardingCompleted).toBe(true);
    expect(new SimulatedVpnService().getSession()).toMatchObject({
      state: 'disconnected',
      simulated: true,
    });
  });

  it('treats an existing prepare() consent and a dialog approval as granted', () => {
    expect(interpretVpnPrepareResult(null)).toBe('granted');
    expect(interpretVpnPrepareResult('granted')).toBe('granted');
  });

  it('treats cancelling the system dialog as deferred, not a permanent denial', async () => {
    expect(interpretVpnPrepareResult('cancelled')).toBe('deferred');
    expect(interpretVpnPrepareResult('denied')).toBe('deferred');
    expect(interpretVpnPrepareResult(undefined)).toBe('deferred');

    NativeModules.VpnPermission = {
      prepare: jest.fn(async () => 'deferred'),
    };
    await expect(requestAndroidVpnPermission()).resolves.toBe('deferred');

    useAppStore.getState().setVpnPermission('deferred');
    expect(useAppStore.getState().vpnPermission).toBe('deferred');
    expect(useAppStore.getState().onboardingCompleted).toBe(false);
    expect(new SimulatedVpnService().getSession()).toMatchObject({
      state: 'disconnected',
      simulated: true,
    });
    delete NativeModules.VpnPermission;
  });

  it('records a granted permission without creating a tunnel', async () => {
    NativeModules.VpnPermission = {
      prepare: jest.fn(async () => 'granted'),
    };
    await expect(requestAndroidVpnPermission()).resolves.toBe('granted');
    useAppStore.getState().setVpnPermission('granted');

    expect(useAppStore.getState().vpnPermission).toBe('granted');
    expect(useAppStore.getState().onboardingCompleted).toBe(false);
    expect(new SimulatedVpnService().getSession().state).toBe('disconnected');
    delete NativeModules.VpnPermission;
  });

  it('keeps completed onboarding after logout and a stored restart', async () => {
    useAppStore.getState().completeOnboarding();
    useAppStore.getState().continueAsGuest();
    useAppStore.getState().setVpnPermission('granted');
    useAppStore.getState().logOut();
    await flushPersistence();
    const snapshot = await AsyncStorage.getItem(STORAGE_KEYS.appState);

    useAppStore.setState({
      onboardingCompleted: false,
      sessionStatus: 'guest',
      vpnPermission: 'unknown',
      hydrated: false,
    });
    await flushPersistence();
    await AsyncStorage.setItem(STORAGE_KEYS.appState, snapshot ?? '');
    await useAppStore.persist.rehydrate();

    const state = useAppStore.getState();
    expect(state.sessionStatus).toBe('signed_out');
    expect(state.onboardingCompleted).toBe(true);
    expect(state.vpnPermission).toBe('granted');
    expect(routeAfterSplash(state.onboardingCompleted)).toBe('Home');
  });

  it('does not treat Google sign-in as available', () => {
    expect(googleSignIn.available).toBe(false);
    expect(googleSignIn.reason.length).toBeGreaterThan(0);
  });
});
