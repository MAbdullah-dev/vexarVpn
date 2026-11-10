import { Pressable, StyleSheet } from 'react-native';

import { colors, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  label: string;
  selected?: boolean;
  icon?: string;
  onPress: () => void;
};

export function AppChip({ label, selected = false, icon, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : styles.idle,
        pressed ? styles.pressed : null,
      ]}>
      {icon ? (
        <Icon
          name={icon}
          size={16}
          color={selected ? colors.onPrimary : colors.onSurfaceVariant}
        />
      ) : null}
      <AppText
        variant="labelMd"
        color={selected ? colors.onPrimary : colors.onSurfaceVariant}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 32,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  idle: {
    backgroundColor: colors.surfaceContainerLow,
    borderColor: colors.outlineGhost,
  },
  pressed: {
    opacity: 0.82,
  },
});
