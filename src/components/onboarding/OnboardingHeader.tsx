import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme';
import { AppText } from '../AppText';
import { Icon } from '../Icon';

type Props = {
  step: 1 | 2 | 3;
  onBack: () => void;
  onSkip?: () => void;
};

export function OnboardingHeader({ step, onBack, onSkip }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={onBack}
        style={styles.back}>
        <Icon name="arrow_back" size={20} color={colors.onSurface} />
      </Pressable>
      <View style={styles.center}>
        <AppText variant="labelMd" color={colors.onSurface}>
          {`GETTING STARTED · ${step} OF 3`}
        </AppText>
        <View style={styles.tracks}>
          {[1, 2, 3].map(item => (
            <View
              key={item}
              style={[styles.track, item <= step ? styles.trackOn : null]}
            />
          ))}
        </View>
      </View>
      {onSkip ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={onSkip}
          hitSlop={8}
          style={styles.skip}>
          <AppText variant="labelLg" color={colors.onSurfaceVariant}>
            Skip
          </AppText>
        </Pressable>
      ) : (
        <View style={styles.skip} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.margin,
    gap: spacing.sm,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  tracks: {
    flexDirection: 'row',
    gap: 6,
  },
  track: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.surfaceContainerHighest,
  },
  trackOn: {
    backgroundColor: colors.primaryContainer,
  },
  skip: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
