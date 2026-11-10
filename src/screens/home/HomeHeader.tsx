import { Image, Pressable, StyleSheet, View } from 'react-native';

import { images } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, radius, spacing } from '../../theme';

type Props = {
  section?: string;
  onPremium: () => void;
  onNotifications: () => void;
  onProfile: () => void;
};

export function HomeHeader({
  section = 'HOME',
  onPremium,
  onNotifications,
  onProfile,
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <Icon name="shield" size={28} filled color={colors.primary} />
        <View>
          <View style={styles.nameRow}>
            <AppText variant="titleMd">VEXRAVPN</AppText>
            <View style={styles.live} />
          </View>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            {section}
          </AppText>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Premium"
          onPress={onPremium}
          style={styles.vip}>
          <Icon name="workspace_premium" size={14} color={colors.primaryFixed} />
          <AppText variant="labelSm" color={colors.primaryFixed}>
            VIP
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications, not available in this stage"
          onPress={onNotifications}
          style={styles.iconButton}>
          <Icon name="notifications" size={20} color={colors.onSurfaceVariant} />
          <View style={styles.badge} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={onProfile}
          style={styles.avatarButton}>
          <Image source={images.profileAvatar} style={styles.avatar} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  live: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  vip: {
    minHeight: spacing.minTouch,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconButton: {
    width: spacing.minTouch,
    height: spacing.minTouch,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  avatarButton: {
    width: spacing.minTouch,
    height: spacing.minTouch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
  },
});
