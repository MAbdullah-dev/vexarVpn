import { useEffect, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '../../components/AppText';
import { FloatingTabBar } from '../../components/FloatingTabBar';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { DEMO_SPEED_DISCLOSURE } from '../../constants/speed';
import { findSampleServer } from '../../constants/servers';
import { useVpnSession } from '../../hooks';
import { placeholderTabs, productTabAction } from '../../navigation/productTabs';
import type { RootStackParamList } from '../../navigation/types';
import { useAppStore } from '../../store';
import { colors, radius, spacing } from '../../theme';
import { DEMO_SESSION_LABEL } from '../../types/vpn';
import { HomeHeader } from '../home/HomeHeader';
import { type HistoryRange } from './historyRange';
import { SpeedGauge } from './SpeedGauge';
import { SpeedHistory } from './SpeedHistory';
import { SpeedMetrics } from './SpeedMetrics';
import { useDemoSpeedTest } from './useDemoSpeedTest';

const phaseCopy = {
  idle: 'DEMO READY',
  preparing: 'PREPARING DEMO',
  download: 'SAMPLE DOWNLOAD',
  upload: 'SAMPLE UPLOAD',
  completing: 'FINISHING DEMO',
  completed: 'DEMO COMPLETE',
  failed: 'DEMO FAILED',
} as const;

export function SpeedTestScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const selectedServerId = useAppStore(state => state.selectedServerId);
  const selected = findSampleServer(selectedServerId);
  const { session } = useVpnSession();
  const speed = useDemoSpeedTest();
  const [range, setRange] = useState<HistoryRange>('day');
  const [notice, setNotice] = useState<string | null>(null);
  const running =
    speed.run.phase === 'preparing' ||
    speed.run.phase === 'download' ||
    speed.run.phase === 'upload' ||
    speed.run.phase === 'completing';
  const sessionServer = findSampleServer(session.serverId);
  const sessionLabel =
    session.state === 'connected'
      ? `Demo session on ${sessionServer?.city ?? 'the selected route'}`
      : 'Demo session disconnected';

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

  const valueLabel =
    speed.run.gaugeMbps == null ? '—' : speed.run.gaugeMbps.toFixed(1);

  return (
    <Screen>
      <View style={styles.header}>
        <HomeHeader
          section="SPEED TEST"
          onPremium={() => navigation.navigate('Premium')}
          onNotifications={() =>
            setNotice('Notifications are not available in this stage.')
          }
          onProfile={() => navigation.navigate('Profile')}
        />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {notice ? (
            <View style={styles.notice}>
              <AppText variant="bodySm" color={colors.onSurfaceVariant}>
                {notice}
              </AppText>
            </View>
          ) : null}
          <View style={styles.titleRow}>
            <AppText variant="headlineMd">Network Performance</AppText>
            <View style={styles.demoPill}>
              <AppText variant="labelSm" color={colors.primary}>
                {DEMO_SESSION_LABEL}
              </AppText>
            </View>
          </View>
          <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
            {DEMO_SPEED_DISCLOSURE}
          </AppText>
          <View style={styles.route}>
            <Icon name="public" size={16} color={colors.primary} />
            <AppText variant="bodySm" numberOfLines={1} style={styles.routeText}>
              {selected
                ? `${selected.city} · ${selected.name}`
                : 'No sample server selected'}
            </AppText>
            <AppText variant="labelSm" color={colors.onSurfaceVariant}>
              Sample layout
            </AppText>
          </View>
          <SpeedGauge
            valueLabel={valueLabel}
            progress={
              speed.run.phase === 'idle' || speed.run.phase === 'failed'
                ? 0
                : speed.run.progress
            }
            caption={phaseCopy[speed.run.phase]}
          />
          <AppText variant="bodySm" color={colors.primary}>
            {sessionLabel}
          </AppText>
          {speed.run.errorMessage ? (
            <AppText variant="bodySm" color={colors.error}>
              {speed.run.errorMessage}
            </AppText>
          ) : null}
          <SpeedMetrics
            download={formatMbps(speed.run.sampleDownloadMbps)}
            upload={formatMbps(speed.run.sampleUploadMbps)}
            ping={
              speed.run.samplePingMs == null
                ? '—'
                : String(speed.run.samplePingMs)
            }
            showDetails={speed.run.phase === 'completed'}
          />
          <SpeedHistory
            history={speed.history}
            range={range}
            now={Date.now()}
            onChangeRange={setRange}
          />
          <View style={styles.card}>
            <AppText variant="titleSm">Demo only</AppText>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              This script does not check DNS, WebRTC, encryption, or a VPN tunnel.
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: running, disabled: running }}
            accessibilityLabel={
              running
                ? `Demo speed test ${phaseCopy[speed.run.phase]}`
                : speed.run.phase === 'failed'
                  ? 'Retry demo speed test'
                  : speed.run.phase === 'completed'
                    ? 'Run demo speed test again'
                    : 'Start demo speed test'
            }
            disabled={running}
            onPress={() => {
              speed.start().catch(() => undefined);
            }}
            style={[styles.start, running ? styles.startBusy : null]}>
            <Icon name="speed" size={18} color={colors.onPrimary} />
            <AppText variant="labelLg" color={colors.onPrimary}>
              {running
                ? phaseCopy[speed.run.phase]
                : speed.run.phase === 'completed'
                  ? 'RUN DEMO AGAIN'
                  : speed.run.phase === 'failed'
                    ? 'RETRY DEMO'
                    : 'START SPEED TEST'}
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leak audit is not part of this demo"
            onPress={() =>
              setNotice('Leak audits are not part of this demo.')
            }
            style={styles.audit}>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              Leak audit is not part of this demo
            </AppText>
            <Icon name="arrow_forward" size={16} color={colors.outline} />
          </Pressable>
      </ScrollView>
      <FloatingTabBar
        active="speed"
        unavailable={placeholderTabs}
        onChange={next => {
          const action = productTabAction(next);
          if (action === 'home') {
            navigation.navigate('Home');
            return;
          }
          if (action === 'servers') {
            navigation.navigate('Servers');
            return;
          }
          if (action === 'speed') {
            return;
          }
          navigation.navigate('Profile');
        }}
      />
    </Screen>
  );
}

function formatMbps(value: number | null): string {
  return value == null ? '—' : value.toFixed(1);
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
  demoPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  route: {
    minHeight: spacing.minTouch,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  routeText: {
    flex: 1,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.md,
    gap: spacing.xs,
  },
  start: {
    minHeight: spacing.minTouch,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  startBusy: {
    opacity: 0.7,
  },
  audit: {
    minHeight: spacing.minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
