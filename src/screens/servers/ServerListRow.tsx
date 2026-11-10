import { Image, Pressable, StyleSheet, View } from 'react-native';

import { flagImages } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import type { SampleServer } from '../../constants/servers';
import { colors, radius, spacing } from '../../theme';

type Props = {
  server: SampleServer;
  selected: boolean;
  favorite: boolean;
  demoSession: boolean;
  onSelect: (serverId: string) => void;
  onToggleFavorite: (serverId: string) => void;
};

export function ServerListRow({
  server,
  selected,
  favorite,
  demoSession,
  onSelect,
  onToggleFavorite,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Select sample server ${server.country}`}
      onPress={() => onSelect(server.id)}
      style={[styles.row, selected ? styles.selected : null]}>
      <Image source={flagImages[server.flag]} style={styles.flag} />
      <View style={styles.copy}>
        <AppText variant="titleSm" numberOfLines={1}>
          {server.country}
        </AppText>
        <AppText variant="bodySm" color={colors.onSurfaceVariant} numberOfLines={1}>
          {`${server.city} · ${server.name}`}
        </AppText>
        <View style={styles.meta}>
          <View style={styles.tag}>
            <AppText variant="labelSm" color={colors.tertiary}>
              {server.tag}
            </AppText>
          </View>
          <AppText variant="labelSm" color={colors.primary}>
            {`${server.sampleLatencyMs} ms sample`}
          </AppText>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            {`${server.sampleLoadPercent}% sample load`}
          </AppText>
        </View>
        {demoSession ? (
          <AppText variant="labelSm" color={colors.primary}>
            Demo session
          </AppText>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          favorite
            ? `Remove ${server.country} from favorites`
            : `Add ${server.country} to favorites`
        }
        onPress={() => onToggleFavorite(server.id)}
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
        accessibilityLabel={`Select ${server.country} sample server`}
        onPress={() => onSelect(server.id)}
        style={styles.iconButton}>
        <Icon name="power_settings_new" size={20} color={colors.primary} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 84,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selected: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  flag: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  iconButton: {
    width: spacing.minTouch,
    height: spacing.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
