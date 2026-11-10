import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import type { DemoSpeedRecord } from '../../services/speed/DemoSpeedTest';
import { colors, radius, spacing } from '../../theme';
import { filterDemoHistory, type HistoryRange } from './historyRange';

const ranges: { id: HistoryRange; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
];

type Props = {
  history: readonly DemoSpeedRecord[];
  range: HistoryRange;
  now: number;
  onChangeRange: (range: HistoryRange) => void;
};

export function SpeedHistory({ history, range, now, onChangeRange }: Props) {
  const points = filterDemoHistory(history, range, now);

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.copy}>
          <AppText variant="titleSm">Demo history</AppText>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            Sample runs from this demo script
          </AppText>
        </View>
        <View style={styles.ranges}>
          {ranges.map(item => {
            const selected = item.id === range;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Show ${item.label} demo history`}
                onPress={() => onChangeRange(item.id)}
                style={[styles.range, selected ? styles.rangeOn : null]}>
                <AppText
                  variant="labelSm"
                  color={selected ? colors.onPrimary : colors.onSurfaceVariant}>
                  {item.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>
      {points.length === 0 ? (
        <AppText variant="bodySm" color={colors.onSurfaceVariant}>
          No demo tests in this range.
        </AppText>
      ) : (
        <View style={styles.chart}>
          {points.map(point => (
            <View key={point.id} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  barScale(point.sampleDownloadMbps),
                ]}
              />
              <AppText variant="labelSm" color={colors.primary}>
                {point.sampleDownloadMbps}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function barScale(mbps: number): { height: number } {
  const height = Math.max(12, Math.min(72, Math.round(mbps / 2)));
  return { height };
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    gap: spacing.md,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  ranges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  range: {
    minHeight: spacing.minTouch,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rangeOn: {
    backgroundColor: colors.primaryContainer,
  },
  chart: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  column: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  bar: {
    width: 18,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryContainer,
  },
});
