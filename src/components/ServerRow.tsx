import {
  Image,
  Pressable,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { colors, radius, spacing } from '../theme';
import { latencyTone } from '../utils/format';
import { AppText } from './AppText';
import { Icon } from './Icon';

type Props = {
  name: string;
  location: string;
  latencyMs: number;
  flag?: ImageSourcePropType;
  tag?: string;
  selected?: boolean;
  favorite?: boolean;
  onPress?: () => void;
  onToggleFavorite?: () => void;
  onConnect?: () => void;
};

const toneColor = {
  good: colors.primary,
  fair: colors.tertiaryFixedDim,
  slow: colors.error,
} as const;

export function ServerRow({
  name,
  location,
  latencyMs,
  flag,
  tag,
  selected = false,
  favorite = false,
  onPress,
  onToggleFavorite,
  onConnect,
}: Props) {
  const tone = toneColor[latencyTone(latencyMs)];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}>
      <View style={styles.flag}>
        {flag ? (
          <Image source={flag} style={styles.flagImage} />
        ) : (
          <Icon name="public" size={18} color={colors.onSurfaceVariant} />
        )}
      </View>
      <View style={styles.copy}>
        <AppText variant="titleSm" numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="bodySm" color={colors.onSurfaceVariant} numberOfLines={1}>
          {location}
        </AppText>
        {tag ? (
          <AppText variant="labelSm" color={colors.primary}>
            {tag}
          </AppText>
        ) : null}
      </View>
      <View style={styles.trailing}>
        <AppText variant="labelMd" color={tone} tabular>
          {latencyMs} ms
        </AppText>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={favorite ? 'Remove favorite' : 'Add favorite'}
            hitSlop={8}
            onPress={onToggleFavorite}
            style={styles.iconButton}>
            <Icon
              name="star"
              size={20}
              filled={favorite}
              color={favorite ? colors.primary : colors.outline}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start demo session"
            hitSlop={8}
            onPress={onConnect}
            style={styles.iconButton}>
            <Icon name="power_settings_new" size={20} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 72,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  pressed: {
    opacity: 0.9,
  },
  flag: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: spacing.minTouch,
    height: spacing.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
