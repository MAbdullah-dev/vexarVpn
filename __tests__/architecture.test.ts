import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../src/constants/storage';
import { billingState } from '../src/services/billing/billing';
import { SimulatedVpnService } from '../src/services/vpn';
import { resetAppStore, useAppStore } from '../src/store';
import { DEMO_SESSION_LABEL } from '../src/types/vpn';

async function flushPersistence(): Promise<void> {
  await new Promise<void>(resolve => {
    setImmediate(() => resolve());
  });
}

async function savedState(): Promise<Record<string, unknown>> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.appState);
  return JSON.parse(raw ?? '{}').state;
}

describe('stage 2 architecture', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetAppStore();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('persists onboarding completion across hydration', async () => {
    useAppStore.getState().completeOnboarding();
    await flushPersistence();
    const snapshot = await AsyncStorage.getItem(STORAGE_KEYS.appState);

    useAppStore.setState({ onboardingCompleted: false, hydrated: false });
    await flushPersistence();
    await AsyncStorage.setItem(STORAGE_KEYS.appState, snapshot ?? '');
    await useAppStore.persist.rehydrate();

    const state = useAppStore.getState();
    expect(state.onboardingCompleted).toBe(true);
    expect(state.hydrated).toBe(true);
    expect(state.sessionStatus).toBe('signed_out');
    expect(await savedState()).toMatchObject({
      onboardingCompleted: true,
      sessionStatus: 'signed_out',
    });
    expect(await savedState()).not.toHaveProperty('hydrated');
  });

  it('keeps onboarding complete when the session logs out', async () => {
    const store = useAppStore.getState();
    store.completeOnboarding();
    store.continueAsGuest();
    store.setVpnPermission('granted');
    store.updateSettings({ autoConnect: true });
    store.selectServer('de-frankfurt-04');
    store.logOut();
    await flushPersistence();

    const state = useAppStore.getState();
    expect(state.onboardingCompleted).toBe(true);
    expect(state.sessionStatus).toBe('signed_out');
    expect(state.vpnPermission).toBe('granted');
    expect(state.settings.autoConnect).toBe(true);
    expect(state.selectedServerId).toBe('de-frankfurt-04');

    const saved = await savedState();
    expect(saved.onboardingCompleted).toBe(true);
    expect(saved.sessionStatus).toBe('signed_out');
    expect(saved.hydrated).toBeUndefined();
  });

  it('does not treat VPN permission as a connection', async () => {
    jest.useFakeTimers();
    const vpn = new SimulatedVpnService(0);

    for (const status of ['unknown', 'deferred', 'granted', 'denied'] as const) {
      useAppStore.getState().setVpnPermission(status);
      expect(useAppStore.getState().vpnPermission).toBe(status);
      expect(vpn.getSession()).toMatchObject({
        state: 'disconnected',
        simulated: true,
        demoLabel: DEMO_SESSION_LABEL,
        serverId: null,
      });
    }

    const pending = vpn.connect('de-frankfurt-04');
    jest.runAllTimers();
    await pending;

    expect(useAppStore.getState().vpnPermission).toBe('denied');
    expect(vpn.getSession()).toMatchObject({
      state: 'connected',
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
      serverId: 'de-frankfurt-04',
    });
  });

  it('stores server selection, favorites, and a capped recent list', async () => {
    const store = useAppStore.getState();
    store.selectServer('de-frankfurt-04');
    store.toggleFavorite('de-frankfurt-04');
    store.toggleFavorite('de-frankfurt-04');
    store.toggleFavorite('nl-amsterdam-01');
    for (let index = 0; index < 9; index += 1) {
      useAppStore.getState().rememberRecent(`s${index}`);
    }
    useAppStore.getState().rememberRecent('s7');

    const state = useAppStore.getState();
    expect(state.selectedServerId).toBe('de-frankfurt-04');
    expect(state.favoriteServerIds).toEqual(['nl-amsterdam-01']);
    expect(state.recentServerIds).toHaveLength(8);
    expect(state.recentServerIds[0]).toBe('s7');
    expect(state.recentServerIds.filter(id => id === 's7')).toHaveLength(1);
    expect(state.recentServerIds).not.toContain('s0');

    useAppStore.getState().selectServer(null);
    expect(useAppStore.getState().selectedServerId).toBeNull();
    useAppStore.getState().selectServer('jp-tokyo-02');
    await flushPersistence();
    const snapshot = await AsyncStorage.getItem(STORAGE_KEYS.appState);
    expect(snapshot).toContain('jp-tokyo-02');
    expect(snapshot).toContain('nl-amsterdam-01');

    useAppStore.setState({
      selectedServerId: null,
      favoriteServerIds: [],
      recentServerIds: [],
    });
    await flushPersistence();
    await AsyncStorage.setItem(STORAGE_KEYS.appState, snapshot ?? '');
    await useAppStore.persist.rehydrate();

    expect(useAppStore.getState().selectedServerId).toBe('jp-tokyo-02');
    expect(useAppStore.getState().favoriteServerIds).toEqual([
      'nl-amsterdam-01',
    ]);
    expect(useAppStore.getState().recentServerIds[0]).toBe('s7');
  });

  it('keeps a simulated session labeled through connection transitions', async () => {
    jest.useFakeTimers();
    const vpn = new SimulatedVpnService(0);

    await vpn.connect('   ');
    expect(vpn.getSession()).toMatchObject({
      state: 'failed',
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
      serverId: null,
      errorMessage: 'Choose a server before starting a demo session.',
    });

    const connecting = vpn.connect('de-frankfurt-04');
    expect(vpn.getSession().state).toBe('connecting');
    expect(vpn.getSession().simulated).toBe(true);
    jest.runAllTimers();
    await connecting;
    expect(vpn.getSession()).toMatchObject({
      state: 'connected',
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
      serverId: 'de-frankfurt-04',
    });
    expect(vpn.getSession().connectedAt).toEqual(expect.any(Number));

    vpn.fail('Select a server. VPN permission does not start a session.');
    expect(vpn.getSession()).toMatchObject({
      state: 'failed',
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
      errorMessage: 'Select a server. VPN permission does not start a session.',
    });

    const disconnecting = vpn.disconnect();
    expect(vpn.getSession().state).toBe('disconnecting');
    jest.runAllTimers();
    await disconnecting;
    expect(vpn.getSession()).toMatchObject({
      state: 'disconnected',
      simulated: true,
      demoLabel: DEMO_SESSION_LABEL,
      serverId: null,
      connectedAt: null,
      errorMessage: null,
    });
  });

  it('leaves billing operations disabled', () => {
    expect(billingState).toEqual({
      connection: 'disconnected',
      purchasesEnabled: false,
      trialsEnabled: false,
      restoreEnabled: false,
    });
    expect(billingState).not.toHaveProperty('price');
    expect(billingState).not.toHaveProperty('prices');
    expect(billingState).not.toHaveProperty('sku');
    expect(billingState).not.toHaveProperty('skus');
    expect(billingState).not.toHaveProperty('trial');
    expect(billingState).not.toHaveProperty('purchase');
  });
});
