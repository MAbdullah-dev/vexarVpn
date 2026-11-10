import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, radius, spacing } from '../../theme';

type ToggleProps = {
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

type LinkProps = {
  icon: string;
  title: string;
  subtitle: string;
  trailing?: string;
  badge?: string;
  accessibilityLabel: string;
  actionIcon?: string;
  onPress: () => void;
};

export function SettingsToggle({
  icon,
  title,
  subtitle,
  badge,
  value,
  onValueChange,
}: ToggleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleLine}>
          <AppText variant="titleSm">{title}</AppText>
          {badge ? (
            <View style={styles.badge}>
              <AppText variant="labelSm" color={colors.tertiary}>
                {badge}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant="labelMd" color={colors.onSurfaceVariant}>
          {subtitle}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        accessibilityLabel={`${title}. ${subtitle}`}
        onPress={() => onValueChange(!value)}
        style={styles.hit}>
        <View pointerEvents="none">
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: colors.surfaceContainerHighest,
              true: colors.primaryContainer,
            }}
            thumbColor={colors.background}
          />
        </View>
      </Pressable>
    </View>
  );
}

export function SettingsLink({
  icon,
  title,
  subtitle,
  trailing,
  badge,
  accessibilityLabel,
  actionIcon = 'chevron_right',
  onPress,
}: LinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.row}>
      <View style={styles.icon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <View style={styles.titleLine}>
          <AppText variant="titleSm">{title}</AppText>
          {badge ? (
            <View style={styles.badge}>
              <AppText variant="labelSm" color={colors.primary}>
                {badge}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant="labelMd" color={colors.onSurfaceVariant}>
          {subtitle}
        </AppText>
      </View>
      {trailing ? (
        <AppText variant="labelSm" color={colors.onSurfaceVariant}>
          {trailing}
        </AppText>
      ) : null}
      <Icon name={actionIcon} size={20} color={colors.outline} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainerHighest,
  },
  hit: {
    minWidth: spacing.minTouch,
    minHeight: spacing.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
