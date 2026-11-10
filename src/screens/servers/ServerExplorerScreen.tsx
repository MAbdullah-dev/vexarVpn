import { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '../../components/AppText';
import { FloatingTabBar } from '../../components/FloatingTabBar';
import { Screen } from '../../components/Screen';
import { sampleServers } from '../../constants/servers';
import { useVpnSession } from '../../hooks';
import { HomeHeader } from '../home/HomeHeader';
import { placeholderTabs, productTabAction } from '../../navigation/productTabs';
import type { RootStackParamList } from '../../navigation/types';
import { useAppStore } from '../../store';
import { colors, radius, spacing } from '../../theme';
import { filterSampleServers, type ServerFilter } from './filterServers';
import { RecentServers } from './RecentServers';
import { RecommendationCard } from './RecommendationCard';
import { ServerFilters } from './ServerFilters';
import { ServerListRow } from './ServerListRow';
import { ServerSearch } from './ServerSearch';

export function ServerExplorerScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedServerId = useAppStore(state => state.selectedServerId);
  const favoriteServerIds = useAppStore(state => state.favoriteServerIds);
  const recentServerIds = useAppStore(state => state.recentServerIds);
  const selectServer = useAppStore(state => state.selectServer);
  const toggleFavorite = useAppStore(state => state.toggleFavorite);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ServerFilter>('all');
  const [notice, setNotice] = useState<string | null>(null);
  const { session } = useVpnSession();
  const visible = filterSampleServers({
    servers: sampleServers,
    query,
    filter,
    favoriteIds: favoriteServerIds,
  });
  const recommendation = visible[0];

  const choose = (serverId: string) => {
    selectServer(serverId);
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Home');
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [navigation]);

  return (
    <Screen>
      <View style={styles.header}>
        <HomeHeader
          section="SERVERS"
          onPremium={() => navigation.navigate('Premium')}
          onNotifications={() =>
            setNotice('Notifications are not available in this stage.')
          }
          onProfile={() => navigation.navigate('Profile')}
        />
      </View>
      <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          {notice ? (
            <View style={styles.notice}>
              <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                {notice}
              </AppText>
            </View>
          ) : null}
          <View style={styles.titleRow}>
            <AppText variant="headlineMd">Explore Servers</AppText>
            <View style={styles.count}>
              <View style={styles.dot} />
              <AppText variant="labelSm" color={colors.primary}>
                {`${sampleServers.length} sample routes`}
              </AppText>
            </View>
          </View>
          <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
            Sample locations for this demo. Selecting one does not start a tunnel.
          </AppText>
          <ServerSearch
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
          />
          <ServerFilters active={filter} onChange={setFilter} />
          {recommendation ? (
            <RecommendationCard server={recommendation} onSelect={choose} />
          ) : (
            <View style={styles.empty}>
              <AppText variant="titleSm">No sample servers match</AppText>
              <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                {query.trim().length > 0
                  ? `Nothing matches “${query.trim()}”.`
                  : 'This filter has no sample routes.'}
              </AppText>
              {query.trim().length > 0 ? (
                <AppText
                  variant="labelLg"
                  color={colors.primary}
                  accessibilityRole="button"
                  onPress={() => setQuery('')}>
                  Clear search
                </AppText>
              ) : null}
            </View>
          )}
          <RecentServers recentIds={recentServerIds} onSelect={choose} />
          <View style={styles.listHeading}>
            <View style={styles.title}>
              <IconMark />
              <AppText variant="titleSm">Sample routes</AppText>
            </View>
            <AppText variant="labelSm" color={colors.onSurfaceVariant}>
              {`${visible.length} sample`}
            </AppText>
          </View>
          {visible.map(server => (
            <ServerListRow
              key={server.id}
              server={server}
              selected={server.id === selectedServerId}
              favorite={favoriteServerIds.includes(server.id)}
              demoSession={
                session.state === 'connected' && session.serverId === server.id
              }
              onSelect={choose}
              onToggleFavorite={toggleFavorite}
            />
          ))}
      </ScrollView>
      <FloatingTabBar
        active="servers"
        unavailable={placeholderTabs}
        onChange={next => {
          const action = productTabAction(next);
          if (action === 'home') {
            if (navigation.canGoBack()) {
              navigation.goBack();
              return;
            }
            navigation.navigate('Home');
            return;
          }
          if (action === 'servers') {
            return;
          }
          if (action === 'speed') {
            navigation.navigate('Speed');
            return;
          }
          navigation.navigate('Profile');
        }}
      />
    </Screen>
  );
}

function IconMark() {
  return <View style={styles.mark} />;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  notice: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  count: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  empty: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.md,
    gap: spacing.sm,
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  mark: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
});
