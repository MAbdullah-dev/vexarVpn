import { Image, Pressable, StyleSheet, View } from 'react-native';

import { images } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, radius, spacing } from '../../theme';

type Stat = {
  icon: string;
  label: string;
  value: string;
};

type Props = {
  name: string;
  badge: string;
  summary: string;
  signIn: string;
  stats: readonly Stat[];
  onManage: () => void;
};

export function AccountCard({
  name,
  badge,
  summary,
  signIn,
  stats,
  onManage,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.identity}>
        <View style={styles.avatarWrap}>
          <Image
            accessibilityLabel={`${name} avatar`}
            source={images.profileAvatar}
            style={styles.avatar}
          />
          <View style={styles.presence} />
        </View>
        <View style={styles.copy}>
          <AppText variant="titleMd" numberOfLines={1}>
            {name}
          </AppText>
          <View style={styles.badge}>
            <AppText variant="labelSm" color={colors.primary}>
              {badge}
            </AppText>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Premium subscription"
          onPress={onManage}
          style={styles.manage}>
          <AppText variant="labelLg" color={colors.onPrimary}>
            Manage
          </AppText>
          <Icon name="open_in_new" size={16} color={colors.onPrimary} />
        </Pressable>
      </View>
      <AppText variant="bodySm" color={colors.onSurfaceVariant}>
        {summary}
      </AppText>
      <AppText variant="bodySm" color={colors.onSurfaceVariant}>
        {signIn}
      </AppText>
      <View style={styles.stats}>
        {stats.map(stat => (
          <View key={stat.label} style={styles.stat}>
            <View style={styles.statLabel}>
              <Icon name={stat.icon} size={14} color={colors.tertiary} />
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                {stat.label}
              </AppText>
            </View>
            <AppText variant="titleSm">{stat.value}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrap: {
    width: 56,
    height: 56,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
  },
  presence: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 14,
    height: 14,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    borderWidth: 2,
    borderColor: colors.surfaceContainer,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  manage: {
    minHeight: spacing.minTouch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  stat: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  statLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
