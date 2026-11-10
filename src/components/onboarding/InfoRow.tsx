import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../../theme';
import { AppText } from '../AppText';
import { Icon } from '../Icon';

type Props = {
  icon: string;
  title: string;
  body: string;
};

export function InfoRow({ icon, title, body }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWell}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.copy}>
        <AppText variant="titleSm">{title}</AppText>
        <AppText variant="bodySm" color={colors.onSurfaceVariant}>
          {body}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
});
