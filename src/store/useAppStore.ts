import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants/storage';
import {
  defaultProfileSettings,
  type ProfileSettings,
} from '../types/profile';
import type { SessionStatus } from '../types/session';
import type { VpnPermissionStatus } from '../types/vpn';

type PersistedSlice = {
  onboardingCompleted: boolean;
  sessionStatus: SessionStatus;
  vpnPermission: VpnPermissionStatus;
  settings: ProfileSettings;
  selectedServerId: string | null;
  favoriteServerIds: string[];
  recentServerIds: string[];
};

type AppState = PersistedSlice & {
  hydrated: boolean;
  completeOnboarding: () => void;
  continueAsGuest: () => void;
  logOut: () => void;
  setVpnPermission: (status: VpnPermissionStatus) => void;
  updateSettings: (patch: Partial<ProfileSettings>) => void;
  setSplitTunnelApps: (appIds: string[]) => void;
  setTrustedNetworks: (names: string[]) => void;
  selectServer: (serverId: string | null) => void;
  toggleFavorite: (serverId: string) => void;
  rememberRecent: (serverId: string) => void;
};

export const initialPersistedState: PersistedSlice = {
  onboardingCompleted: false,
  sessionStatus: 'signed_out',
  vpnPermission: 'unknown',
  settings: defaultProfileSettings,
  selectedServerId: null,
  favoriteServerIds: [],
  recentServerIds: [],
};

export const useAppStore = create<AppState>()(
  persist(
    set => ({
      ...initialPersistedState,
      hydrated: false,
      completeOnboarding: () => set({ onboardingCompleted: true }),
      continueAsGuest: () => set({ sessionStatus: 'guest' }),
      logOut: () => set({ sessionStatus: 'signed_out' }),
      setVpnPermission: vpnPermission => set({ vpnPermission }),
      updateSettings: patch =>
        set(state => ({ settings: { ...state.settings, ...patch } })),
      setSplitTunnelApps: splitTunnelAppIds =>
        set(state => ({
          settings: { ...state.settings, splitTunnelAppIds },
        })),
      setTrustedNetworks: trustedNetworkNames =>
        set(state => ({
          settings: { ...state.settings, trustedNetworkNames },
        })),
      selectServer: selectedServerId => set({ selectedServerId }),
      toggleFavorite: serverId =>
        set(state => ({
          favoriteServerIds: state.favoriteServerIds.includes(serverId)
            ? state.favoriteServerIds.filter(id => id !== serverId)
            : [...state.favoriteServerIds, serverId],
        })),
      rememberRecent: serverId =>
        set(state => ({
          recentServerIds: [
            serverId,
            ...state.recentServerIds.filter(id => id !== serverId),
          ].slice(0, 8),
        })),
    }),
    {
      name: STORAGE_KEYS.appState,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        onboardingCompleted: state.onboardingCompleted,
        sessionStatus: state.sessionStatus,
        vpnPermission: state.vpnPermission,
        settings: state.settings,
        selectedServerId: state.selectedServerId,
        favoriteServerIds: state.favoriteServerIds,
        recentServerIds: state.recentServerIds,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);

export function resetAppStore(): void {
  useAppStore.setState({ ...initialPersistedState, hydrated: true });
}
