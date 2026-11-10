import { useEffect, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '../../components/AppText';
import { FloatingTabBar } from '../../components/FloatingTabBar';
import { Screen } from '../../components/Screen';
import { findSampleServer, homeSampleServers } from '../../constants/servers';
import { placeholderTabs, productTabAction } from '../../navigation/productTabs';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing } from '../../theme';
import { formatDuration } from '../../utils/format';
import { connectionStatus, homeHardwareBack } from './connectionPresentation';
import { HomeHeader } from './HomeHeader';
import { HomeHero } from './HomeHero';
import { HomeMetrics } from './HomeMetrics';
import { HomeRecommendations } from './HomeRecommendations';
import { HomeServerCard } from './HomeServerCard';
import { useHomeActions } from './useHomeActions';

const laterNotices = {
  notifications: 'Notifications are not available in this stage.',
} as const;

export function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { session, now, selectedServerId, toggle, chooseServer } = useHomeActions();
  const [notice, setNotice] = useState<string | null>(null);
  const copy = connectionStatus(session.state, session.errorMessage);
  const selected = findSampleServer(selectedServerId);
  const sessionServer = findSampleServer(session.serverId);
  const showSessionServer =
    session.state === 'connecting' ||
    session.state === 'connected' ||
    session.state === 'disconnecting';
  const shown = selected ?? (showSessionServer ? sessionServer : undefined);
  const sessionNote =
    showSessionServer &&
    sessionServer &&
    shown &&
    sessionServer.id !== shown.id
      ? `Demo session stays on ${sessionServer.city}.`
      : undefined;
  const duration =
    session.state === 'connected' && session.connectedAt
      ? formatDuration(now - session.connectedAt)
      : formatDuration(0);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      return homeHardwareBack('home') === 'home';
    });
    return () => subscription.remove();
  }, []);

  return (
    <Screen>
      <View style={styles.header}>
        <HomeHeader
          onPremium={() => navigation.navigate('Premium')}
          onNotifications={() => setNotice(laterNotices.notifications)}
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
          <HomeHero
            state={session.state}
            copy={copy}
            duration={duration}
            onPress={() => {
              toggle().catch(() => undefined);
            }}
          />
          <HomeServerCard
            server={shown}
            connected={session.state === 'connected' && shown?.id === session.serverId}
            note={sessionNote}
            onChange={() => navigation.navigate('Servers')}
          />
          <HomeMetrics
            connected={session.state === 'connected'}
            samplePingMs={shown?.sampleLatencyMs}
          />
          <HomeRecommendations
            servers={homeSampleServers}
            selectedId={selectedServerId}
            connectedId={
              session.state === 'connected' ? session.serverId : null
            }
            onSelect={serverId => {
              chooseServer(serverId);
              setNotice(null);
            }}
            onSeeAll={() => navigation.navigate('Servers')}
          />
      </ScrollView>
      <FloatingTabBar
        active="home"
        unavailable={placeholderTabs}
        onChange={next => {
          const action = productTabAction(next);
          if (action === 'servers') {
            navigation.navigate('Servers');
            return;
          }
          if (action === 'speed') {
            navigation.navigate('Speed');
            return;
          }
          if (action === 'profile') {
            navigation.navigate('Profile');
            return;
          }
          setNotice(null);
        }}
      />
    </Screen>
  );
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
});
