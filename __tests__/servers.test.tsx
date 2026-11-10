import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Text, TextInput } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { STORAGE_KEYS } from '../src/constants/storage';
import { sampleServers } from '../src/constants/servers';
import { HomeScreen } from '../src/screens/home/HomeScreen';
import {
  filterSampleServers,
  serversBackAction,
} from '../src/screens/servers/filterServers';
import { ServerExplorerScreen } from '../src/screens/servers/ServerExplorerScreen';
import { productTabAction } from '../src/navigation/productTabs';
import { simulatedVpn } from '../src/services/vpn';
import { resetAppStore, useAppStore } from '../src/store';

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

function renderExplorer(): ReactTestRenderer.ReactTestRenderer {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <ServerExplorerScreen />
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

async function flushPersistence(): Promise<void> {
  jest.useRealTimers();
  await new Promise<void>(resolve => {
    setImmediate(() => resolve());
  });
  jest.useFakeTimers();
}

describe('server explorer', () => {
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

  it('lists six sample routes and searches by country, city, and server name', () => {
    expect(sampleServers).toHaveLength(6);
    expect(sampleServers.map(server => server.country)).toEqual([
      'Germany',
      'Netherlands',
      'United States',
      'United Kingdom',
      'Japan',
      'Singapore',
    ]);

    expect(
      filterSampleServers({
        servers: sampleServers,
        query: 'japan',
        filter: 'all',
        favoriteIds: [],
      }).map(server => server.city),
    ).toEqual(['Tokyo']);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: 'london',
        filter: 'all',
        favoriteIds: [],
      }).map(server => server.name),
    ).toEqual(['Node UK-LDN-04']);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: 'node sg-02',
        filter: 'all',
        favoriteIds: [],
      }).map(server => server.country),
    ).toEqual(['Singapore']);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: 'no-such-place',
        filter: 'all',
        favoriteIds: [],
      }),
    ).toEqual([]);
  });

  it('filters sample categories and sorts the fastest sample routes', () => {
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: '',
        filter: 'streaming',
        favoriteIds: [],
      }).map(server => server.city),
    ).toEqual(['Frankfurt', 'New York', 'London']);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: '',
        filter: 'gaming',
        favoriteIds: [],
      }).map(server => server.city),
    ).toEqual(['Tokyo', 'Singapore']);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: '',
        filter: 'dedicated',
        favoriteIds: [],
      }).map(server => server.city),
    ).toEqual(['Amsterdam']);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: '',
        filter: 'fastest',
        favoriteIds: [],
      }).map(server => server.sampleLatencyMs),
    ).toEqual([17, 23, 31, 48]);
    expect(
      filterSampleServers({
        servers: sampleServers,
        query: '',
        filter: 'favorites',
        favoriteIds: ['jp-tokyo-09'],
      }).map(server => server.city),
    ).toEqual(['Tokyo']);
    expect(serversBackAction(false)).toBe('home');
    expect(serversBackAction(true)).toBe('explorer');
    expect(productTabAction('servers')).toBe('servers');
    expect(productTabAction('home')).toBe('home');
    expect(productTabAction('speed')).toBe('speed');
    expect(productTabAction('profile')).toBe('profile');
  });

  it('renders the explorer, clears an empty search, and does not start a session', async () => {
    renderer = renderExplorer();
    const text = collectText(renderer);
    expect(text).toContain('VEXRAVPN');
    expect(text).toContain('Explore Servers');
    expect(text).toContain('6 sample routes');
    expect(text).toContain('Germany');
    expect(text).toContain('United Kingdom');
    expect(text).toContain('ms sample');
    expect(text).toContain('% sample load');
    expect(text).not.toContain('Guardian Net');
    expect(text).not.toContain('encrypted relay');
    expect(simulatedVpn.getSession().state).toBe('disconnected');

    const input = renderer.root.findByType(TextInput);
    await ReactTestRenderer.act(async () => {
      input.props.onChangeText('atlantis');
    });
    expect(collectText(renderer)).toContain('No sample servers match');

    await pressLabel(renderer, 'Clear search');
    expect(collectText(renderer)).toContain('Frankfurt');
    expect(collectText(renderer)).not.toContain('No sample servers match');
  });

  it('adds and removes a favorite and keeps it after rehydration', async () => {
    renderer = renderExplorer();
    await pressLabel(renderer, 'Add Japan to favorites');
    expect(useAppStore.getState().favoriteServerIds).toEqual(['jp-tokyo-09']);
    await pressLabel(renderer, 'Show Favorites');
    expect(collectText(renderer)).toContain('Tokyo');
    expect(collectText(renderer)).not.toContain('Frankfurt');

    await pressLabel(renderer, 'Remove Japan from favorites');
    expect(useAppStore.getState().favoriteServerIds).toEqual([]);
    ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
    renderer = undefined;

    useAppStore.getState().toggleFavorite('gb-london-04');
    await flushPersistence();
    const snapshot = await AsyncStorage.getItem(STORAGE_KEYS.appState);
    useAppStore.setState({ favoriteServerIds: [], hydrated: false });
    await flushPersistence();
    await AsyncStorage.setItem(STORAGE_KEYS.appState, snapshot ?? '');
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().favoriteServerIds).toEqual(['gb-london-04']);
  });

  it('selects a server without connecting and returns home', async () => {
    renderer = renderExplorer();
    await pressLabel(renderer, 'Select United Kingdom sample server');
    expect(useAppStore.getState().selectedServerId).toBe('gb-london-04');
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'disconnected',
      serverId: null,
    });
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('keeps the current demo session when another sample server is selected', async () => {
    useAppStore.getState().selectServer('de-frankfurt-04');
    const pending = simulatedVpn.connect('de-frankfurt-04');
    await ReactTestRenderer.act(async () => {
      jest.advanceTimersByTime(900);
    });
    await pending;
    renderer = renderExplorer();
    await pressLabel(renderer, 'Select Netherlands sample server');
    expect(useAppStore.getState().selectedServerId).toBe('nl-amsterdam-12');
    expect(simulatedVpn.getSession()).toMatchObject({
      state: 'connected',
      serverId: 'de-frankfurt-04',
      simulated: true,
    });

    ReactTestRenderer.act(() => {
      renderer?.unmount();
    });
    let home!: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      home = ReactTestRenderer.create(
        <SafeAreaProvider initialMetrics={initialMetrics}>
          <HomeScreen />
        </SafeAreaProvider>,
      );
    });
    renderer = home;
    const text = collectText(home);
    expect(text).toContain('Netherlands — Amsterdam');
    expect(text).toContain('Demo session stays on Frankfurt.');
  });

  it('opens Speed Test and Profile from the bottom tabs', async () => {
    renderer = renderExplorer();
    await pressLabel(renderer, 'Speed');
    expect(mockNavigate).toHaveBeenCalledWith('Speed');
    await pressTab(renderer, 'Profile');
    expect(mockNavigate).toHaveBeenCalledWith('Profile');
    await pressLabel(renderer, 'Open Premium');
    expect(mockNavigate).toHaveBeenCalledWith('Premium');
    await pressLabel(renderer, 'Home');
    expect(mockGoBack).toHaveBeenCalled();
  });
});
