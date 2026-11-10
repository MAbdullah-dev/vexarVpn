import React from 'react';
import { Text, TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { APP_VERSION } from '../src/constants/profile';
import { STORAGE_KEYS } from '../src/constants/storage';
import { ProfileScreen } from '../src/screens/profile/ProfileScreen';
import {
  addLocalName,
  profileBackAction,
  removeLocalName,
} from '../src/screens/profile/profileModel';
import { simulatedVpn } from '../src/services/vpn';
import { resetAppStore, useAppStore } from '../src/store';
import { defaultProfileSettings } from '../src/types/profile';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      canGoBack: () => true,
    }),
  };
});

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function flatten(value: unknown): string {
  if (value == null || typeof value === 'boolean') {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(flatten).join('');
  }
  return '';
}

function collectText(renderer: ReactTestRenderer.ReactTestRenderer): string {
  return renderer.root
    .findAllByType(Text)
    .map(node => flatten(node.props.children))
    .join('\n');
}

function renderProfile(): ReactTestRenderer.ReactTestRenderer {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <ProfileScreen />
      </SafeAreaProvider>,
    );
  });
  return renderer;
}

async function pressLabel(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
) {
  const node = renderer.root.findByProps({ accessibilityLabel: label });
  await ReactTestRenderer.act(async () => {
    node.props.onPress();
  });
}

async function pressTab(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
) {
  const node = renderer.root
    .findAllByProps({ accessibilityRole: 'tab' })
    .find(item => item.props.accessibilityLabel === label);
  if (!node) {
    throw new Error(`Missing tab ${label}`);
  }
  await ReactTestRenderer.act(async () => {
    node.props.onPress();
  });
}

async function typeInto(
  renderer: ReactTestRenderer.ReactTestRenderer,
  label: string,
  value: string,
) {
  const input = renderer.root.findByType(TextInput);
  expect(input.props.accessibilityLabel).toBe(label);
  await ReactTestRenderer.act(async () => {
    input.props.onChangeText(value);
  });
}

async function flushPersistence(): Promise<void> {
  jest.useRealTimers();
  await new Promise<void>(resolve => {
    setImmediate(() => resolve());
  });
  jest.useFakeTimers();
}

describe('profile settings', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  beforeEach(async () => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
    mockGoBack.mockClear();
    await AsyncStorage.clear();
    resetAppStore();
    simulatedVpn.reset();
  });

  afterEach(() => {
    if (renderer) {
      ReactTestRenderer.act(() => {
        renderer?.unmount();
      });
    }
    renderer = undefined;
    simulatedVpn.reset();
    jest.useRealTimers();
  });

  it('renders a signed-out guest-free profile with local-only copy', () => {
    renderer = renderProfile();
    const text = collectText(renderer);
    expect(text).toContain('VEXRAVPN');
    expect(text).toContain('Signed out');
    expect(text).toContain('SIGNED OUT');
    expect(text).toContain('No account is signed in.');
    expect(text).toContain('Google sign-in is not connected yet.');
    expect(text).toContain('Plan');
    expect(text).toContain('None');
    expect(text).toContain('Saved on this device');
    expect(text).toContain('None saved.');
    expect(text).toContain('0 saved');
    expect(text).toContain(`v${APP_VERSION}`);
    expect(text).not.toContain('Guardian Net');
    expect(text).not.toContain('CyberSpecialist');
    expect(text).not.toContain('VIP SUBSCRIBER');
    expect(text).not.toContain('ChaCha20');
    expect(text).not.toContain('ZeroLog');
    expect(text).not.toContain('All Shields Active');
  });

  it('presents guest mode without an account', () => {
    useAppStore.getState().continueAsGuest();
    renderer = renderProfile();
    const text = collectText(renderer);
    expect(text).toContain('Guest');
    expect(text).toContain('GUEST');
    expect(text).toContain('Guest mode. No account is signed in.');
    expect(
      renderer.root.findByProps({
        accessibilityLabel: 'Log out of the guest session',
      }),
    ).toBeTruthy();
  });

  it('saves security toggles and explains that they do not protect traffic', async () => {
    renderer = renderProfile();
    await pressLabel(
      renderer,
      'Auto-Connect Shield. Saved preference. This build does not detect Wi-Fi or start a session.',
    );
    await pressLabel(
      renderer,
      'System Kill Switch. Saved preference. This build does not drop internet traffic.',
    );
    await pressLabel(
      renderer,
      'Threat & Tracker Blocker. Saved preference. This build does not block hostnames or trackers.',
    );
    expect(useAppStore.getState().settings).toMatchObject({
      autoConnect: true,
      killSwitch: true,
      threatBlocker: true,
    });
    expect(collectText(renderer)).toContain(
      'Threat blocker is saved on this device. This build does not block hostnames or trackers.',
    );
  });

  it('keeps protocol, DNS, and toggles after rehydration', async () => {
    renderer = renderProfile();
    await pressLabel(
      renderer,
      'Auto-Connect Shield. Saved preference. This build does not detect Wi-Fi or start a session.',
    );
    await pressLabel(renderer, 'Edit VPN protocol');
    expect(collectText(renderer)).toContain(
      'This build does not start a WireGuard tunnel.',
    );
    await pressLabel(renderer, 'Select WireGuard');
    await pressLabel(renderer, 'Back to profile');
    await pressLabel(renderer, 'Edit DNS preference');
    expect(collectText(renderer)).toContain(
      'This build does not change the device DNS configuration.',
    );
    await pressLabel(renderer, 'Select Cloudflare 1.1.1.1');
    await pressLabel(renderer, 'Back to profile');
    await pressLabel(renderer, 'Edit app theme');
    await pressLabel(renderer, 'Select Obsidian Dark');
    expect(useAppStore.getState().settings).toMatchObject({
      autoConnect: true,
      protocol: 'wireguard',
      dnsResolver: 'cloudflare',
      theme: 'obsidian-dark',
    });

    ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
    renderer = undefined;
    await flushPersistence();
    const snapshot = await AsyncStorage.getItem(STORAGE_KEYS.appState);
    useAppStore.setState({ settings: defaultProfileSettings, hydrated: false });
    await flushPersistence();
    await AsyncStorage.setItem(STORAGE_KEYS.appState, snapshot ?? '');
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().settings.autoConnect).toBe(true);
    expect(useAppStore.getState().settings.protocol).toBe('wireguard');
    expect(useAppStore.getState().settings.dnsResolver).toBe('cloudflare');
    expect(useAppStore.getState().settings.theme).toBe('obsidian-dark');
  });

  it('stores trusted-network names as a local list', async () => {
    expect(addLocalName([], '  ')).toMatchObject({ result: 'empty' });
    expect(addLocalName(['Cafe'], 'cafe')).toMatchObject({ result: 'duplicate' });
    expect(removeLocalName(['Cafe'], 'Cafe')).toEqual([]);
    expect(profileBackAction(true)).toBe('profile');
    expect(profileBackAction(false)).toBe('previous');

    renderer = renderProfile();
    expect(collectText(renderer)).toContain('None saved.');
    await pressLabel(renderer, 'Edit trusted networks');
    expect(collectText(renderer)).toContain(
      'This build does not detect Wi-Fi or change the VPN session.',
    );
    expect(collectText(renderer)).toContain('No trusted networks saved.');
    await typeInto(renderer, 'Trusted network name', 'Cafe');
    await pressLabel(renderer, 'Add trusted network');
    expect(useAppStore.getState().settings.trustedNetworkNames).toEqual(['Cafe']);
    expect(collectText(renderer)).toContain('Cafe');
    await pressLabel(renderer, 'Remove Cafe');
    expect(useAppStore.getState().settings.trustedNetworkNames).toEqual([]);
  });

  it('shows notices for help, about, and premium', async () => {
    renderer = renderProfile();
    await pressLabel(renderer, 'Help and support');
    expect(collectText(renderer)).toContain('Help is not available in this build.');
    expect(mockNavigate).not.toHaveBeenCalled();
    await pressLabel(renderer, 'About VEXRAVPN');
    expect(collectText(renderer)).toContain(
      `VEXRAVPN ${APP_VERSION}. This demo build has no published support page or legal URL.`,
    );
    await pressLabel(renderer, 'Open Premium subscription');
    expect(mockNavigate).toHaveBeenCalledWith('Premium');
  });

  it('logs out without clearing onboarding, servers, favorites, or preferences', async () => {
    useAppStore.getState().completeOnboarding();
    useAppStore.getState().continueAsGuest();
    useAppStore.getState().setVpnPermission('granted');
    useAppStore.getState().selectServer('de-frankfurt-04');
    useAppStore.getState().toggleFavorite('nl-amsterdam-12');
    useAppStore.getState().updateSettings({ autoConnect: true });
    renderer = renderProfile();
    await pressLabel(renderer, 'Log out of the guest session');
    const state = useAppStore.getState();
    expect(state.sessionStatus).toBe('signed_out');
    expect(state.onboardingCompleted).toBe(true);
    expect(state.vpnPermission).toBe('granted');
    expect(state.selectedServerId).toBe('de-frankfurt-04');
    expect(state.favoriteServerIds).toEqual(['nl-amsterdam-12']);
    expect(state.settings.autoConnect).toBe(true);
    expect(collectText(renderer)).toContain('Signed out');
  });

  it('leaves the demo VPN session unchanged when settings change', async () => {
    useAppStore.getState().selectServer('de-frankfurt-04');
    const pending = simulatedVpn.connect('de-frankfurt-04');
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(900);
    });
    await pending;
    renderer = renderProfile();
    await pressLabel(
      renderer,
      'Auto-Connect Shield. Saved preference. This build does not detect Wi-Fi or start a session.',
    );
    await pressLabel(renderer, 'Edit VPN protocol');
    await pressLabel(renderer, 'Select WireGuard');
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'connected',
      serverId: 'de-frankfurt-04',
      simulated: true,
    });
    expect(useAppStore.getState().vpnPermission).toBe('unknown');
  });

  it('opens Home, Servers, and Speed from the profile tab bar', async () => {
    renderer = renderProfile();
    await pressTab(renderer, 'Home');
    expect(mockNavigate).toHaveBeenCalledWith('Home');
    await pressTab(renderer, 'Servers');
    expect(mockNavigate).toHaveBeenCalledWith('Servers');
    await pressTab(renderer, 'Speed');
    expect(mockNavigate).toHaveBeenCalledWith('Speed');
  });
});
