import { StyleSheet, View, type ViewStyle } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import {
  SAMPLE_DOWNLOAD_MBPS,
  SAMPLE_FIGURES_NOTE,
  SAMPLE_UPLOAD_MBPS,
} from '../../constants/servers';
import { colors, radius, spacing } from '../../theme';

type Props = {
  connected: boolean;
  samplePingMs?: number;
};

export function HomeMetrics({ connected, samplePingMs }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        <Metric
          icon="arrow_downward"
          label="Download"
          value={connected ? SAMPLE_DOWNLOAD_MBPS : '—'}
          unit="Mbps"
          tone={colors.tertiaryFixedDim}
          barStyle={styles.barIce}
          bars={downloadBars}
        />
        <Metric
          icon="arrow_upward"
          label="Upload"
          value={connected ? SAMPLE_UPLOAD_MBPS : '—'}
          unit="Mbps"
          tone={colors.primary}
          barStyle={styles.barPrimary}
          bars={uploadBars}
        />
        <Metric
          icon="network_ping"
          label="Ping"
          value={connected && samplePingMs != null ? String(samplePingMs) : '—'}
          unit="ms"
          tone={colors.onSurfaceVariant}
          bars={null}
          caption={connected ? 'Sample' : undefined}
        />
      </View>
      <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.note}>
        {SAMPLE_FIGURES_NOTE}
      </AppText>
    </View>
  );
}

function Metric({
  icon,
  label,
  value,
  unit,
  tone,
  bars,
  barStyle,
  caption,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  tone: string;
  bars: ReadonlyArray<keyof typeof barHeight> | null;
  barStyle?: ViewStyle;
  caption?: string;
}) {
  return (
    <View
      style={styles.metric}
      accessibilityLabel={`${label} sample ${value} ${unit}. ${SAMPLE_FIGURES_NOTE}`}>
      <View style={styles.metricLabel}>
        <Icon name={icon} size={16} color={tone} />
        <AppText variant="labelSm" color={tone}>
          {label.toUpperCase()}
        </AppText>
      </View>
      <View style={styles.valueRow}>
        <AppText variant="headlineSm" tabular>
          {value}
        </AppText>
        <AppText variant="labelSm" color={colors.onSurfaceVariant}>
          {unit}
        </AppText>
      </View>
      {bars ? (
        <View style={styles.bars}>
          {bars.map((height, index) => (
            <View
              key={`${label}-${height}-${index}`}
              style={[styles.bar, barHeight[height], barStyle]}
            />
          ))}
        </View>
      ) : (
        <View style={styles.samplePill}>
          <View style={styles.sampleDot} />
          <AppText variant="labelSm" color={colors.primary}>
            {caption ?? 'Sample'}
          </AppText>
        </View>
      )}
    </View>
  );
}

const downloadBars = ['h8', 'h16', 'h10', 'h18', 'h12', 'h14'] as const;
const uploadBars = ['h14', 'h10', 'h18', 'h8', 'h16', 'h12'] as const;

const barHeight = StyleSheet.create({
  h8: { height: 8 },
  h10: { height: 10 },
  h12: { height: 12 },
  h14: { height: 14 },
  h16: { height: 16 },
  h18: { height: 18 },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
    gap: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  metricLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  bars: {
    height: 18,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    width: 4,
    borderRadius: radius.full,
    opacity: 0.85,
  },
  barIce: {
    backgroundColor: colors.tertiaryFixedDim,
  },
  barPrimary: {
    backgroundColor: colors.primary,
  },
  samplePill: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.primaryTint,
  },
  sampleDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  note: {
    textAlign: 'center',
  },
});
