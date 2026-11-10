import { Image, Pressable, StyleSheet, View } from 'react-native';

import { flagImages } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import type { SampleServer } from '../../constants/servers';
import { colors, radius, spacing } from '../../theme';

type Props = {
  server: SampleServer;
  onSelect: (serverId: string) => void;
};

export function RecommendationCard({ server, onSelect }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.label}>
          <Icon name="verified" size={16} color={colors.primary} />
          <AppText variant="labelSm" color={colors.primary}>
            SAMPLE RECOMMENDATION
          </AppText>
        </View>
        <View style={styles.latency}>
          <AppText variant="labelSm" color={colors.primaryFixed}>
            {`${server.sampleLatencyMs} ms sample`}
          </AppText>
        </View>
      </View>
      <View style={styles.bottom}>
        <View style={styles.identity}>
          <Image source={flagImages[server.flag]} style={styles.flag} />
          <View style={styles.copy}>
            <AppText variant="titleMd" numberOfLines={1}>
              {`${server.city}, ${server.country}`}
            </AppText>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              {`${server.sampleLoadPercent}% sample load`}
            </AppText>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select recommended sample server ${server.country}`}
          onPress={() => onSelect(server.id)}
          style={styles.select}>
          <Icon name="power_settings_new" size={18} color={colors.onPrimary} />
          <AppText variant="labelLg" color={colors.onPrimary}>
            Select
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    gap: spacing.md,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  latency: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flag: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  select: {
    minHeight: spacing.minTouch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
