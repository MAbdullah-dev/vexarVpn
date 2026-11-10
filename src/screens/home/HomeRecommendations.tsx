import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { flagImages } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { type SampleServer } from '../../constants/servers';
import { colors, radius, spacing } from '../../theme';

type Props = {
  servers: readonly SampleServer[];
  selectedId: string | null;
  connectedId: string | null;
  onSelect: (serverId: string) => void;
  onSeeAll: () => void;
};

export function HomeRecommendations({
  servers,
  selectedId,
  connectedId,
  onSelect,
  onSeeAll,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.heading}>
        <View style={styles.title}>
          <Icon name="hub" size={20} color={colors.primary} />
          <AppText variant="titleSm">Sample servers</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all sample servers"
          onPress={onSeeAll}
          style={styles.seeAll}>
          <AppText variant="labelSm" color={colors.primary}>
            See all
          </AppText>
          <Icon name="chevron_right" size={16} color={colors.primary} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {servers.map(server => {
          const selected = server.id === selectedId;
          const connected = server.id === connectedId;
          return (
            <View
              key={server.id}
              style={[styles.card, connected ? styles.cardOn : null]}>
              <View style={styles.cardTop}>
                <View style={styles.country}>
                  <Image source={flagImages[server.flag]} style={styles.flag} />
                  <AppText variant="titleSm" numberOfLines={1}>
                    {server.country}
                  </AppText>
                </View>
                <View style={styles.badge}>
                  <AppText
                    variant="labelSm"
                    color={connected ? colors.primary : colors.onSurfaceVariant}>
                    {connected ? 'Demo on' : selected ? 'Selected' : server.label}
                  </AppText>
                </View>
              </View>
              <View style={styles.meta}>
                <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                  {server.location}
                </AppText>
                <AppText variant="labelSm" color={colors.primary}>
                  {`${server.sampleLatencyMs} ms sample`}
                </AppText>
              </View>
              <View style={styles.cardBottom}>
                <View style={styles.tag}>
                  <AppText variant="labelSm" color={colors.tertiaryFixedDim}>
                    {server.tag}
                  </AppText>
                </View>
                {connected ? (
                  <View style={styles.connected}>
                    <Icon name="check_circle" size={14} color={colors.primary} />
                    <AppText variant="labelSm" color={colors.primary}>
                      Demo
                    </AppText>
                  </View>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${server.country} sample server`}
                    onPress={() => onSelect(server.id)}
                    style={styles.switch}>
                    <AppText variant="labelSm" color={colors.primary}>
                      {selected ? 'Selected' : 'Switch'}
                    </AppText>
                    <Icon name="arrow_forward" size={14} color={colors.primary} />
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
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
  seeAll: {
    minHeight: spacing.minTouch,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  card: {
    width: 232,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: 14,
    gap: spacing.sm,
  },
  cardOn: {
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  country: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  flag: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainer,
  },
  switch: {
    minHeight: spacing.minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  connected: {
    minHeight: spacing.minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
