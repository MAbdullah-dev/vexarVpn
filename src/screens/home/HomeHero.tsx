import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, radius, spacing } from '../../theme';
import type { VpnConnectionState } from '../../types/vpn';
import type { ConnectionCopy } from './connectionPresentation';

type Props = {
  state: VpnConnectionState;
  copy: ConnectionCopy;
  duration: string;
  onPress: () => void;
};

export function HomeHero({ state, copy, duration, onPress }: Props) {
  const spin = useRef(new Animated.Value(0)).current;
  const busy = state === 'connecting' || state === 'disconnecting';
  const failed = state === 'failed';
  const connected = state === 'connected';

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
      <View
        style={[
          styles.pill,
          failed ? styles.pillFailed : null,
          connected ? styles.pillOn : null,
        ]}>
        <View style={[styles.dot, failed ? styles.dotFailed : null]} />
        <AppText
          variant="labelLg"
          color={failed ? colors.error : colors.primary}>
          {copy.title}
        </AppText>
        {failed ? (
          <Icon name="error" size={16} filled color={colors.error} />
        ) : null}
      </View>
      <AppText variant="bodySm" color={colors.onSurfaceVariant} style={styles.detail}>
        {copy.detail}
      </AppText>
      <View style={styles.orb}>
        <View style={styles.ringOuter} />
        <View style={styles.ringMid} />
        <View style={[styles.spark, styles.sparkA]} />
        <View style={[styles.spark, styles.sparkB]} />
        <View style={[styles.spark, styles.sparkC]} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.accessibilityLabel}
          accessibilityState={{ busy }}
          onPress={onPress}
          style={styles.hit}>
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
              color={failed ? colors.error : colors.primary}
            />
            <AppText variant="labelSm" color={failed ? colors.error : colors.primary}>
              {copy.control}
            </AppText>
          </View>
        </Pressable>
      </View>
      <View style={styles.timer}>
        <Icon name="timer" size={16} color={colors.primaryContainer} />
        <AppText variant="headlineSm" tabular>
          {duration}
        </AppText>
      </View>
      <AppText variant="labelSm" color={colors.onSurfaceVariant}>
        Demo session duration
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  pillOn: {
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  pillFailed: {
    backgroundColor: 'rgba(255, 180, 171, 0.08)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  dotFailed: {
    backgroundColor: colors.error,
  },
  detail: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  orb: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineGhost,
  },
  ringMid: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: colors.halo,
    backgroundColor: colors.primaryTint,
  },
  spark: {
    position: 'absolute',
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  sparkA: { top: 28, left: 168, width: 7, height: 7 },
  sparkB: { top: 64, left: 24, width: 5, height: 5, backgroundColor: colors.tertiaryFixedDim },
  sparkC: { top: 188, left: 196, width: 6, height: 6 },
  hit: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweep: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: colors.primaryContainer,
  },
  core: {
    width: 112,
    height: 112,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    gap: 2,
  },
  coreOn: {
    borderColor: colors.primaryContainer,
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  coreFailed: {
    borderColor: colors.error,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
  },
});
