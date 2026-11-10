import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { flagImages } from '../../assets/images';
import {
  AppButton,
  AppCard,
  AppChip,
  AppText,
  ConnectControl,
  FloatingTabBar,
  Screen,
  ServerRow,
  type TabKey,
} from '../../components';
import { useVpnSession } from '../../hooks';
import type { RootStackParamList } from '../../navigation/types';
import { billingState } from '../../services/billing/billing';
import { requestAndroidVpnPermission } from '../../services/vpn/vpnPermission';
import { useAppStore } from '../../store';
import { colors, spacing } from '../../theme';
import { formatDuration } from '../../utils/format';

const previewServer = {
  id: 'de-frankfurt-04',
  name: 'Germany',
  location: 'Frankfurt #04',
  latencyMs: 17,
};

export function FoundationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<TabKey>('home');
  const [filter, setFilter] = useState('All');
  const onboardingCompleted = useAppStore(state => state.onboardingCompleted);
  const sessionStatus = useAppStore(state => state.sessionStatus);
  const vpnPermission = useAppStore(state => state.vpnPermission);
  const hydrated = useAppStore(state => state.hydrated);
  const selectedServerId = useAppStore(state => state.selectedServerId);
  const favoriteServerIds = useAppStore(state => state.favoriteServerIds);
  const completeOnboarding = useAppStore(state => state.completeOnboarding);
  const continueAsGuest = useAppStore(state => state.continueAsGuest);
  const logOut = useAppStore(state => state.logOut);
  const setVpnPermission = useAppStore(state => state.setVpnPermission);
  const selectServer = useAppStore(state => state.selectServer);
  const toggleFavorite = useAppStore(state => state.toggleFavorite);
  const rememberRecent = useAppStore(state => state.rememberRecent);
  const vpn = useVpnSession();
  const elapsed =
    vpn.session.state === 'connected' && vpn.session.connectedAt
      ? formatDuration(vpn.now - vpn.session.connectedAt)
      : undefined;

  const startDemo = (serverId: string) => {
    selectServer(serverId);
    rememberRecent(serverId);
    vpn.connect(serverId);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <AppText variant="labelMd" color={colors.primary}>
          VEXRAVPN
        </AppText>
        <AppText variant="headlineSm">Foundation</AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          Theme, type, and saved preferences are running. Product screens stay
          out of this stage.
        </AppText>

        <ConnectControl
          state={vpn.session.state}
          detail={elapsed}
          onPress={() => {
            if (
              vpn.session.state === 'connected' ||
              vpn.session.state === 'connecting'
            ) {
              vpn.disconnect();
              return;
            }
            if (!selectedServerId) {
              vpn.fail(
                'Select a server. VPN permission does not start a session.',
              );
              return;
            }
            vpn.connect(selectedServerId);
          }}
        />
        {vpn.session.errorMessage ? (
          <AppText variant="bodySm" color={colors.error}>
            {vpn.session.errorMessage}
          </AppText>
        ) : null}

        <AppCard>
          <AppText variant="titleSm">Saved state</AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            Onboarding complete: {onboardingCompleted ? 'yes' : 'no'}
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            Session: {sessionStatus}
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            VPN permission: {vpnPermission}
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            {vpn.session.demoLabel}: {vpn.session.state}
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            Billing: {billingState.connection}
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            Storage ready: {hydrated ? 'yes' : 'loading'}
          </AppText>
        </AppCard>

        <View style={styles.actions}>
          <AppButton label="Guest" variant="tonal" onPress={continueAsGuest} />
          <AppButton label="Log out" variant="outlined" onPress={logOut} />
        </View>
        <AppButton
          label="Mark onboarding complete"
          variant="text"
          onPress={completeOnboarding}
        />
        <AppButton
          label="Grant VPN permission"
          variant="outlined"
          onPress={() => {
            requestAndroidVpnPermission()
              .then(setVpnPermission)
              .catch(() => undefined);
          }}
        />

        <View style={styles.chips}>
          {['All', 'Fastest', 'Streaming'].map(item => (
            <AppChip
              key={item}
              label={item}
              selected={filter === item}
              onPress={() => setFilter(item)}
            />
          ))}
        </View>

        <ServerRow
          name={previewServer.name}
          location={previewServer.location}
          latencyMs={previewServer.latencyMs}
          tag="Component preview"
          flag={flagImages.de}
          selected={selectedServerId === previewServer.id}
          favorite={favoriteServerIds.includes(previewServer.id)}
          onPress={() => selectServer(previewServer.id)}
          onToggleFavorite={() => toggleFavorite(previewServer.id)}
          onConnect={() => startDemo(previewServer.id)}
        />

        <AppButton
          label="Open stack detail"
          icon="arrow_forward"
          onPress={() => navigation.navigate('FoundationDetail')}
        />
      </ScrollView>
      <FloatingTabBar active={tab} onChange={setTab} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
