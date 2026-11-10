import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { colors, radius, spacing } from '../../theme';

type Props = {
  title: string;
  body: string;
  onBack: () => void;
};

export function StagePlaceholder({ title, body, onBack }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <AppText variant="titleMd">{title}</AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          {body}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
          onPress={onBack}
          style={styles.back}>
          <AppText variant="labelLg" color={colors.onPrimary}>
            Back to Home
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    paddingHorizontal: spacing.margin,
    justifyContent: 'center',
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.lg,
    gap: spacing.md,
  },
  back: {
    minHeight: spacing.minTouch,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
