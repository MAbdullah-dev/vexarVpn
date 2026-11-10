import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Variant = 'primary' | 'tonal' | 'outlined' | 'text';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: string;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'leading',
  disabled = false,
  style,
}: Props) {
  const palette = palettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primaryHeight : styles.compactHeight,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: disabled ? 0.45 : pressed ? 0.84 : 1,
        },
        variant === 'primary' && !disabled ? styles.glow : null,
        style,
      ]}>
      <View style={styles.content}>
        {icon && iconPosition === 'leading' ? (
          <Icon name={icon} size={20} color={palette.label} />
        ) : null}
        <AppText variant="labelLg" color={palette.label}>
          {label}
        </AppText>
        {icon && iconPosition === 'trailing' ? (
          <Icon name={icon} size={20} color={palette.label} />
        ) : null}
      </View>
    </Pressable>
  );
}

const palettes: Record<
  Variant,
  { background: string; border: string; label: string }
> = {
  primary: {
    background: colors.primaryContainer,
    border: colors.primaryContainer,
    label: colors.onPrimary,
  },
  tonal: {
    background: colors.surfaceContainerHigh,
    border: colors.surfaceContainerHigh,
    label: colors.primary,
  },
  outlined: {
    background: 'transparent',
    border: colors.outlineGhost,
    label: colors.primary,
  },
  text: {
    background: 'transparent',
    border: 'transparent',
    label: colors.onSurfaceVariant,
  },
};

const styles = StyleSheet.create({
  base: {
    minWidth: 120,
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  primaryHeight: {
    minHeight: 56,
  },
  compactHeight: {
    minHeight: spacing.minTouch,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  glow: {
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
});
