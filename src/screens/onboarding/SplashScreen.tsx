import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { routeAfterSplash } from '../../navigation/onboarding';
import type { RootStackParamList } from '../../navigation/types';
import { useAppStore } from '../../store';
import { colors, fonts, spacing } from '../../theme';
import { DEMO_BUILD_NOTE } from '../../types/vpn';

const DURATION_MS = 1600;

export function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Splash'>>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = Date.now();
    let frame = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) {
        return;
      }
      const elapsed = Date.now() - started;
      const value = Math.min(1, elapsed / DURATION_MS);
      setProgress(value);
      const { hydrated, onboardingCompleted } = useAppStore.getState();
      if (value >= 1 && hydrated) {
        navigation.replace(routeAfterSplash(onboardingCompleted));
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [navigation]);

  const percent = Math.round(progress * 100);

  return (
    <Screen>
      <View style={styles.body}>
        <View style={styles.halo}>
          <View style={styles.ring} />
          <View style={styles.shield}>
            <Icon name="verified_user" size={72} color={colors.primary} />
          </View>
        </View>
        <AppText variant="headlineSm" style={styles.wordmark}>
          VEXRAVPN
        </AppText>
        <View style={styles.tagline}>
          <View style={styles.tagDot} />
          <AppText variant="labelMd" color={colors.primary}>
            DEMO BUILD
          </AppText>
        </View>
        <View style={styles.chip}>
          <Icon name="verified_user" size={14} color={colors.primary} />
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            NO TUNNEL YET
          </AppText>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressLabel}>
            <View style={styles.progressTitle}>
              <Icon name="sync" size={16} color={colors.primary} />
              <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                Preparing this demo
              </AppText>
            </View>
            <AppText variant="labelMd" color={colors.primary} tabular>
              {`${percent}%`}
            </AppText>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
        </View>
        <View style={styles.privacy}>
          <Icon name="lock" size={14} color={colors.onSurfaceVariant} />
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            {DEMO_BUILD_NOTE}
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.margin,
    gap: spacing.md,
  },
  halo: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  ring: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.halo,
    backgroundColor: colors.primaryTint,
  },
  shield: {
    width: 132,
    height: 132,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 2,
    borderColor: colors.primaryContainer,
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  wordmark: {
    fontFamily: fonts.extraBold,
    letterSpacing: 3,
    textAlign: 'center',
  },
  tagline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  progressBlock: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  progressLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryContainer,
  },
  privacy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});
