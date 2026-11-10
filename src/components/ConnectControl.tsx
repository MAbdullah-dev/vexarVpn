import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import {
  DEMO_CONNECTION_NOTE,
  DEMO_SESSION_LABEL,
  type VpnConnectionState,
} from '../types/vpn';
import { colors, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { DemoBadge } from './DemoBadge';
import { Icon } from './Icon';

type Props = {
  state: VpnConnectionState;
  onPress: () => void;
  detail?: string;
};

const labels: Record<VpnConnectionState, string> = {
  disconnected: 'Off',
  connecting: 'Connecting',
  connected: 'On',
  disconnecting: 'Disconnecting',
  failed: 'Failed',
};

export function ConnectControl({ state, onPress, detail }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const busy = state === 'connecting' || state === 'disconnecting';
  const connected = state === 'connected';
  const failed = state === 'failed';

  useEffect(() => {
    if (!busy) {
      spin.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [busy, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.wrap}>
      <DemoBadge label={DEMO_SESSION_LABEL} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${labels[state]}. ${DEMO_SESSION_LABEL}`}
        onPress={onPress}
        style={styles.hit}>
        <View
          style={[
            styles.halo,
            connected ? styles.haloOn : null,
            failed ? styles.haloFailed : null,
          ]}
        />
        {busy ? (
          <Animated.View style={[styles.sweep, { transform: [{ rotate }] }]} />
        ) : null}
        <View
          style={[
            styles.core,
            connected ? styles.coreOn : null,
            failed ? styles.coreFailed : null,
          ]}>
          <Icon
            name="power_settings_new"
            size={42}
            filled={connected}
            color={
              connected
                ? colors.onPrimary
                : failed
                  ? colors.error
                  : colors.primary
            }
          />
          <AppText
            variant="labelMd"
            color={connected ? colors.onPrimary : colors.onSurface}>
            {labels[state]}
          </AppText>
        </View>
      </Pressable>
      {detail ? (
        <AppText variant="titleMd" tabular>
          {detail}
        </AppText>
      ) : null}
      <AppText
        variant="bodySm"
        color={colors.onSurfaceVariant}
        style={styles.note}>
        {DEMO_CONNECTION_NOTE}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  hit: {
    width: 168,
    height: 168,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 156,
    height: 156,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    backgroundColor: colors.primaryTint,
  },
  haloOn: {
    borderColor: colors.halo,
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  haloFailed: {
    borderColor: colors.error,
    backgroundColor: 'rgba(255, 180, 171, 0.08)',
  },
  sweep: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: radius.full,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: colors.primaryContainer,
  },
  core: {
    width: 112,
    height: 112,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 2,
    borderColor: colors.outline,
    gap: 2,
  },
  coreOn: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  coreFailed: {
    borderColor: colors.error,
  },
  note: {
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
