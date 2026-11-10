import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: jest.fn(),
      canGoBack: () => true,
    }),
  };
});

import {
  connectionStatus,
  homeHardwareBack,
  resolveHomeToggle,
} from '../src/screens/home/connectionPresentation';
import { HomeScreen } from '../src/screens/home/HomeScreen';
import { routeAfterSplash } from '../src/navigation/onboarding';
import { SimulatedVpnService, simulatedVpn } from '../src/services/vpn';
import { resetAppStore, useAppStore } from '../src/store';
import { DEMO_CONNECTION_NOTE, DEMO_SESSION_LABEL } from '../src/types/vpn';

const GERMANY = 'de-frankfurt-04';

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

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

function renderHome(): ReactTestRenderer.ReactTestRenderer {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <HomeScreen />
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

describe('home hub', () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  beforeEach(async () => {
    jest.useFakeTimers();
    mockNavigate.mockClear();
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

  it('describes every connection state as a demo session', () => {
    expect(connectionStatus('disconnected', null)).toMatchObject({
      title: 'DEMO · DISCONNECTED',
      control: 'OFF',
      detail: DEMO_CONNECTION_NOTE,
    });
    expect(connectionStatus('connecting', null).title).toBe('DEMO · CONNECTING');
    expect(connectionStatus('connected', null)).toMatchObject({
      title: 'DEMO · CONNECTED',
      control: 'ON',
      detail: DEMO_CONNECTION_NOTE,
    });
    expect(connectionStatus('disconnecting', null).title).toBe(
      'DEMO · DISCONNECTING',
    );
    expect(connectionStatus('failed', 'Demo route unavailable.').detail).toBe(
      'Demo route unavailable.',
    );
    expect(connectionStatus('failed', 'Demo route unavailable.').control).toBe(
      'RETRY',
    );
  });

  it('routes the connection control without duplicate requests', () => {
    expect(resolveHomeToggle({ state: 'disconnected', selectedServerId: null })).toEqual({
      type: 'need-server',
    });
    expect(
      resolveHomeToggle({ state: 'failed', selectedServerId: GERMANY }),
    ).toEqual({ type: 'connect', serverId: GERMANY });
    expect(
      resolveHomeToggle({ state: 'connecting', selectedServerId: GERMANY }),
    ).toEqual({ type: 'ignore' });
    expect(
      resolveHomeToggle({ state: 'disconnecting', selectedServerId: GERMANY }),
    ).toEqual({ type: 'ignore' });
    expect(
      resolveHomeToggle({ state: 'connected', selectedServerId: GERMANY }),
    ).toEqual({ type: 'disconnect' });
    expect(homeHardwareBack('home')).toBe('exit');
    expect(homeHardwareBack('servers')).toBe('home');
  });

  it('ignores a second connect or disconnect while one is already running', async () => {
    const vpn = new SimulatedVpnService(500);
    const first = vpn.connect(GERMANY);
    const second = vpn.connect('nl-amsterdam-12');
    expect(vpn.getSession()).toMatchObject({
      state: 'connecting',
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
      serverId: GERMANY,
    });
    jest.advanceTimersByTime(500);
    await first;
    await second;
    expect(vpn.getSession()).toMatchObject({
      state: 'connected',
      serverId: GERMANY,
    });

    const stopping = vpn.disconnect();
    const again = vpn.disconnect();
    expect(vpn.getSession().state).toBe('disconnecting');
    jest.advanceTimersByTime(500);
    await stopping;
    await again;
    expect(vpn.getSession()).toMatchObject({
      state: 'disconnected',
      serverId: null,
      simulated: true,
    });
  });

  it('renders a disconnected home hub and does not invent a connection', () => {
    renderer = renderHome();
    const text = collectText(renderer);
    expect(text).toContain('VEXRAVPN');
    expect(text).toContain('DEMO · DISCONNECTED');
    expect(text).toContain('Choose a sample server');
    expect(text).toContain(DEMO_CONNECTION_NOTE);
    expect(text).not.toContain('Guardian Net');
    expect(text).not.toContain('WireGuard');
    expect(text).not.toContain('Encrypted tunnel');
    expect(simulatedVpn.getSession().state).toBe('disconnected');
  });

  it('fails with a retry path when no server is selected', async () => {
    renderer = renderHome();
    await pressLabel(
      renderer,
      connectionStatus('disconnected', null).accessibilityLabel,
    );

    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'failed',
      simulated: true,
      serverId: null,
      errorMessage: 'Choose a server before starting a demo session.',
    });
    expect(collectText(renderer)).toContain('DEMO · FAILED');
    expect(collectText(renderer)).toContain(
      'Choose a server before starting a demo session.',
    );
  });

  it('shows connecting, then connected sample data, then disconnecting', async () => {
    useAppStore.getState().selectServer(GERMANY);
    renderer = renderHome();
    await pressLabel(
      renderer,
      connectionStatus('disconnected', null).accessibilityLabel,
    );
    expect(simulatedVpn.getSession().state).toBe('connecting');
    expect(collectText(renderer)).toContain('DEMO · CONNECTING');

    await pressLabel(
      renderer,
      connectionStatus('connecting', null).accessibilityLabel,
    );
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'connecting',
      serverId: GERMANY,
    });

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(900);
    });
    expect(simulatedVpn.getSession().state).toBe('connected');
    const connected = collectText(renderer);
    expect(connected).toContain('DEMO · CONNECTED');
    expect(connected).toContain('Sample figures. Not a live measurement.');
    expect(connected).toContain('84.6');
    expect(connected).toContain('Germany — Frankfurt');
    expect(connected).not.toContain('CONNECTED & SECURE');
    expect(connected).not.toContain('WireGuard');

    await pressLabel(
      renderer,
      connectionStatus('connected', null).accessibilityLabel,
    );
    expect(simulatedVpn.getSession().state).toBe('disconnecting');
    expect(collectText(renderer)).toContain('DEMO · DISCONNECTING');

    await pressLabel(
      renderer,
      connectionStatus('disconnecting', null).accessibilityLabel,
    );
    expect(simulatedVpn.getSession().state).toBe('disconnecting');

    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(900);
    });
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'disconnected',
      simulated: true,
      serverId: null,
    });
    expect(collectText(renderer)).toContain('DEMO · DISCONNECTED');
  });

  it('retries a failed demo session after a server is selected', async () => {
    renderer = renderHome();
    await ReactTestRenderer.act(async () => {
      simulatedVpn.fail('Demo route unavailable.');
    });
    expect(collectText(renderer)).toContain('DEMO · FAILED');
    expect(collectText(renderer)).toContain('Demo route unavailable.');

    await pressLabel(renderer, 'Select Germany sample server');
    expect(useAppStore.getState().selectedServerId).toBe(GERMANY);
    expect(simulatedVpn.getSession().state).toBe('failed');

    await pressLabel(
      renderer,
      connectionStatus('failed', 'Demo route unavailable.').accessibilityLabel,
    );
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'connecting',
      serverId: GERMANY,
      simulated: true,
    });
  });

  it('selects a sample server without starting a session', async () => {
    renderer = renderHome();
    await pressLabel(renderer, 'Select Netherlands sample server');
    expect(useAppStore.getState().selectedServerId).toBe('nl-amsterdam-12');
    expect(useAppStore.getState().recentServerIds[0]).toBe('nl-amsterdam-12');
    expect(simulatedVpn.getSession().state).toBe('disconnected');
    expect(collectText(renderer)).toContain('Netherlands — Amsterdam');
  });

  it('keeps a granted permission from starting the demo session', () => {
    useAppStore.getState().setVpnPermission('granted');
    renderer = renderHome();
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'disconnected',
      simulated: true,
    });
    expect(useAppStore.getState().vpnPermission).toBe('granted');
    expect(collectText(renderer)).toContain('DEMO · DISCONNECTED');
  });

  it('opens Servers, Speed, and Profile from the bottom tabs', async () => {
    renderer = renderHome();
    await pressLabel(renderer, 'Servers');
    expect(mockNavigate).toHaveBeenCalledWith('Servers');
    expect(collectText(renderer)).toContain('DEMO · DISCONNECTED');

    await pressLabel(renderer, 'Speed');
    expect(mockNavigate).toHaveBeenCalledWith('Speed');

    await pressTab(renderer, 'Profile');
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
    await pressLabel(renderer, 'Open Premium');
    expect(mockNavigate).toHaveBeenCalledWith('Premium');
    expect(collectText(renderer)).toContain('DEMO · DISCONNECTED');
  });

  it('shows the selected server and keeps a different demo session in place', async () => {
    useAppStore.getState().selectServer(GERMANY);
    const pending = simulatedVpn.connect(GERMANY);
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(900);
      await pending;
    });
    useAppStore.getState().selectServer('nl-amsterdam-12');
    renderer = renderHome();
    const text = collectText(renderer);
    expect(text).toContain('Netherlands — Amsterdam');
    expect(text).toContain('Demo session stays on Frankfurt.');
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'connected',
      serverId: GERMANY,
    });
  });

  it('opens Home after onboarding and keeps that completion after logout', () => {
    expect(routeAfterSplash(false)).toBe('Welcome');
    expect(routeAfterSplash(true)).toBe('Home');
    useAppStore.getState().completeOnboarding();
    useAppStore.getState().continueAsGuest();
    useAppStore.getState().logOut();
    const state = useAppStore.getState();
    expect(state.sessionStatus).toBe('signed_out');
    expect(state.onboardingCompleted).toBe(true);
    expect(routeAfterSplash(state.onboardingCompleted)).toBe('Home');
  });
});
