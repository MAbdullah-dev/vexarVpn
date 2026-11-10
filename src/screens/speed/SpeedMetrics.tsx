import { StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import {
  DEMO_SPEED_JITTER_MS,
  DEMO_SPEED_LOSS_PERCENT,
  DEMO_SPEED_MTU_BYTES,
  DEMO_SPEED_PEAK_MBPS,
} from '../../constants/speed';
import { colors, radius, spacing } from '../../theme';

type Props = {
  download: string;
  upload: string;
  ping: string;
  showDetails: boolean;
};

export function SpeedMetrics({ download, upload, ping, showDetails }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.facts}>
        <Fact label="Sample MTU" value={`${DEMO_SPEED_MTU_BYTES} bytes`} />
        <Fact label="Sample peak" value={`${DEMO_SPEED_PEAK_MBPS} Mbps`} />
      </View>
      <View style={styles.row}>
        <Metric
          icon="arrow_downward"
          label="Download"
          value={download}
          unit="Mbps"
          tone={colors.tertiaryFixedDim}
          note="Sample"
        />
        <Metric
          icon="arrow_upward"
          label="Upload"
          value={upload}
          unit="Mbps"
          tone={colors.primary}
          note="Sample"
        />
        <Metric
          icon="graphic_eq"
          label="Latency"
          value={ping}
          unit="ms"
          tone={colors.onSurfaceVariant}
          note={
            showDetails
              ? `${DEMO_SPEED_JITTER_MS} ms sample jitter · ${DEMO_SPEED_LOSS_PERCENT}% sample loss`
              : 'Sample'
          }
        />
      </View>
    </View>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <AppText variant="labelSm" color={colors.onSurfaceVariant}>
        {label}
      </AppText>
      <AppText variant="titleSm">{value}</AppText>
    </View>
  );
}

function Metric({
  icon,
  label,
  value,
  unit,
  tone,
  note,
}: {
  icon: string;
  label: string;
  value: string;
  unit: string;
  tone: string;
  note: string;
}) {
  return (
    <View
      accessibilityLabel={`${label} sample ${value} ${unit}. ${note}`}
      style={styles.metric}>
      <View style={styles.metricLabel}>
        <Icon name={icon} size={16} color={tone} />
        <AppText variant="labelSm" color={tone}>
          {label.toUpperCase()}
        </AppText>
      </View>
      <AppText variant="headlineSm" tabular>
        {value}
      </AppText>
      <AppText variant="labelSm" color={colors.onSurfaceVariant}>
        {unit}
      </AppText>
      <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.note}>
        {note}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  facts: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  fact: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    padding: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metricLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  note: {
    textAlign: 'center',
  },
});
