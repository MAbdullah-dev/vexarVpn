import { Image, Pressable, StyleSheet, View } from 'react-native';

import { flagImages } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { findSampleServer } from '../../constants/servers';
import { colors, radius, spacing } from '../../theme';

type Props = {
  recentIds: readonly string[];
  onSelect: (serverId: string) => void;
};

export function RecentServers({ recentIds, onSelect }: Props) {
  const servers = recentIds
    .map(id => findSampleServer(id))
    .filter(server => server != null)
    .slice(0, 2);

  return (
    <View style={styles.wrap}>
      <View style={styles.heading}>
        <View style={styles.title}>
          <Icon name="history" size={18} color={colors.outline} />
          <AppText variant="titleSm">Recent sample servers</AppText>
        </View>
        <AppText variant="labelSm" color={colors.onSurfaceVariant}>
          {`${servers.length} sample`}
        </AppText>
      </View>
      {servers.length === 0 ? (
        <AppText variant="bodySm" color={colors.onSurfaceVariant}>
          Servers you choose in this demo appear here.
        </AppText>
      ) : (
        <View style={styles.grid}>
          {servers.map(server => (
            <Pressable
              key={server.id}
              accessibilityRole="button"
              accessibilityLabel={`Select recent sample server ${server.city}`}
              onPress={() => onSelect(server.id)}
              style={styles.card}>
              <View style={styles.cardTop}>
                <Image source={flagImages[server.flag]} style={styles.flag} />
                <AppText variant="labelSm" color={colors.primaryFixed}>
                  {`${server.sampleLatencyMs} ms sample`}
                </AppText>
              </View>
              <AppText variant="titleSm" numberOfLines={1}>
                {server.city}
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                {server.country}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    minHeight: 96,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flag: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
  },
});
