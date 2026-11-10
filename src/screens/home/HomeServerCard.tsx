import { Image, Pressable, StyleSheet, View } from 'react-native';

import { flagImages } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import {
  SAMPLE_ADDRESS,
  SAMPLE_ADDRESS_NOTE,
  type SampleServer,
} from '../../constants/servers';
import { colors, radius, spacing } from '../../theme';

type Props = {
  server: SampleServer | undefined;
  connected: boolean;
  note?: string;
  onChange: () => void;
};

export function HomeServerCard({ server, connected, note, onChange }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.identity}>
          <View style={styles.flagWrap}>
            {server ? (
              <Image source={flagImages[server.flag]} style={styles.flag} />
            ) : (
              <Icon name="public" size={22} color={colors.onSurfaceVariant} />
            )}
            {connected ? <View style={styles.online} /> : null}
          </View>
          <View style={styles.copy}>
            <AppText variant="titleSm" numberOfLines={1}>
              {server ? `${server.country} — ${server.city}` : 'Choose a sample server'}
            </AppText>
            <AppText
              variant="bodySm"
              color={colors.onSurfaceVariant}
              numberOfLines={2}>
              {server
                ? connected
                  ? `${SAMPLE_ADDRESS_NOTE} ${SAMPLE_ADDRESS} · ${server.sampleLatencyMs} ms sample`
                  : `${server.location} · ${server.sampleLatencyMs} ms sample`
                : 'A demo session stays off until a server is selected.'}
            </AppText>
            {note ? (
              <AppText variant="labelSm" color={colors.tertiaryFixedDim}>
                {note}
              </AppText>
            ) : null}
          </View>
        </View>
        <View style={styles.side}>
          <View style={styles.protocol}>
            <Icon name="lock" size={13} filled color={colors.primary} />
            <AppText variant="labelSm">Sample data</AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              server ? 'Change sample server' : 'Choose a sample server'
            }
            onPress={onChange}
            style={styles.change}>
            <AppText variant="labelSm" color={colors.primary}>
              {server ? 'Change' : 'Choose'}
            </AppText>
            <Icon name="swap_horiz" size={14} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing.md,
  },
  row: {
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
  flagWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flag: {
    width: 32,
    height: 24,
    borderRadius: 4,
  },
  online: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  side: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  protocol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  change: {
    minHeight: 32,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
