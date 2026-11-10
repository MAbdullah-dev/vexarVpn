import { StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { colors, radius, spacing } from '../../theme';

type Props = {
  valueLabel: string;
  progress: number;
  caption: string;
};

export function SpeedGauge({ valueLabel, progress, caption }: Props) {
  const turn = Math.max(0, Math.min(1, progress)) * 180;

  return (
    <View
      accessibilityLabel={`Sample gauge ${valueLabel}. ${caption}`}
      style={styles.wrap}>
      <View style={styles.clip}>
        <View style={styles.track} />
        <View
          style={[
            styles.arc,
            { transform: [{ rotate: `${turn - 180}deg` }] },
          ]}
        />
      </View>
      <AppText variant="headlineLg" tabular>
        {valueLabel}
      </AppText>
      <AppText variant="labelSm" color={colors.onSurfaceVariant}>
        Mbps sample
      </AppText>
      <View style={styles.badge}>
        <AppText variant="labelSm" color={colors.primary}>
          {caption}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  clip: {
    width: 220,
    height: 110,
    overflow: 'hidden',
    alignItems: 'center',
  },
  track: {
    position: 'absolute',
    top: 0,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 14,
    borderColor: colors.surfaceContainer,
  },
  arc: {
    position: 'absolute',
    top: 0,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 14,
    borderColor: 'transparent',
    borderTopColor: colors.primaryContainer,
    borderLeftColor: colors.primaryContainer,
  },
  badge: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primaryTint,
  },
});
