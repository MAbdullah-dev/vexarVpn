import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { InfoRow } from '../../components/onboarding/InfoRow';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { Screen } from '../../components/Screen';
import { deferPermissionAndEnter, openMainApp } from '../../navigation/onboarding';
import type { RootStackParamList } from '../../navigation/types';
import { requestAndroidVpnPermission } from '../../services/vpn/vpnPermission';
import { useAppStore } from '../../store';
import { colors, radius, spacing } from '../../theme';
import { DEMO_BUILD_NOTE, type VpnPermissionStatus } from '../../types/vpn';

const cards = [
  {
    icon: 'hub',
    title: 'Why Android asks',
    body: 'This permission lets the app ask Android for a VPN interface. Accepting it does not start a tunnel or mark you connected.',
  },
  {
    icon: 'tune',
    title: "You're in control",
    body: 'You can disconnect later from the quick settings tray, or revoke access in Android system settings.',
  },
];

export function VpnPermissionScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'VpnPermission'>>();
  const permission = useAppStore(state => state.vpnPermission);
  const setVpnPermission = useAppStore(state => state.setVpnPermission);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const askAndroid = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const result = await requestAndroidVpnPermission();
      setVpnPermission(result);
      setMessage(
        result === 'granted'
          ? 'VPN permission granted. This does not start a protected tunnel.'
          : 'Android permission was not granted. You can allow it later. No tunnel was started.',
      );
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Permission request failed.';
      setMessage(detail);
    } finally {
      setBusy(false);
    }
  };

  const granted = permission === 'granted';

  return (
    <Screen>
      <OnboardingHeader step={3} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.art}>
          <View style={styles.statusRow}>
            <Icon name="vpn_key" size={14} color={colors.primary} />
            <AppText variant="labelSm" color={colors.primary}>
              DEMO
            </AppText>
          </View>
          <View style={styles.orb}>
            <Icon name="shield" size={42} color={colors.primary} />
          </View>
          <View style={styles.tunnel}>
            <View style={styles.dot} />
            <AppText variant="labelSm" color={colors.primary}>
              NO TUNNEL
            </AppText>
          </View>
        </View>
        <AppText variant="headlineSm" style={styles.title}>
          Android VPN permission
        </AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          {DEMO_BUILD_NOTE} Android may ask before an app creates a VPN
          interface. Allowing that request in this demo does not start one.
        </AppText>
        {cards.map(card => (
          <InfoRow key={card.title} {...card} />
        ))}
        <View style={styles.requirement}>
          <AppText variant="labelSm" color={colors.primary}>
            SYSTEM REQUIREMENT
          </AppText>
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            Android will display its own native VPN request dialog next. Review
            it before tapping OK.
          </AppText>
        </View>
        <PermissionStatus permission={permission} message={message} />
        <AppButton
          label={granted ? 'CONTINUE' : 'CONTINUE TO ANDROID PERMISSION'}
          icon={granted ? undefined : 'shield'}
          disabled={busy}
          onPress={() => {
            if (granted) {
              openMainApp(navigation);
              return;
            }
            askAndroid();
          }}
        />
        <AppButton
          label="Not now"
          variant="text"
          onPress={() => {
            if (useAppStore.getState().vpnPermission !== 'granted') {
              deferPermissionAndEnter(navigation);
              return;
            }
            openMainApp(navigation);
          }}
        />
        <AppText variant="bodySm" color={colors.onSurfaceVariant} style={styles.later}>
          You can answer Android later. This demo still will not start a tunnel.
        </AppText>
      </ScrollView>
    </Screen>
  );
}

function PermissionStatus({
  permission,
  message,
}: {
  permission: VpnPermissionStatus;
  message: string | null;
}) {
  if (!message && permission === 'unknown') {
    return null;
  }
  return (
    <View style={styles.status}>
      <AppText variant="labelMd" color={colors.primary}>
        {`Permission: ${permission}`}
      </AppText>
      {message ? (
        <AppText variant="bodySm" color={colors.onSurfaceVariant}>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  art: {
    height: 210,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  orb: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },
  tunnel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
  },
  title: {
    textAlign: 'center',
  },
  requirement: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    padding: spacing.md,
    gap: spacing.xs,
  },
  status: {
    gap: spacing.xs,
  },
  later: {
    textAlign: 'center',
  },
});
