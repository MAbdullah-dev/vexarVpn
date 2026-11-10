import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme';
import { AppText } from '../AppText';
import { Icon } from '../Icon';

export function DefenseOrb() {
  return (
    <View style={styles.wrap}>
      <View style={styles.ringOuter} />
      <View style={styles.ringMid} />
      <View style={styles.core}>
        <Icon name="shield_lock" size={46} color={colors.primary} />
      </View>
      <View style={[styles.spark, styles.sparkA]} />
      <View style={[styles.spark, styles.sparkB]} />
      <View style={[styles.spark, styles.sparkC]} />
      <View style={[styles.spark, styles.sparkD]} />
      <View style={[styles.spark, styles.sparkE]} />
      <View style={styles.badge}>
        <View style={styles.dot} />
        <AppText variant="labelSm" color={colors.primary}>
          DEFENSE ACTIVE
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 230,
    height: 230,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.outlineGhost,
  },
  ringMid: {
    position: 'absolute',
    width: 156,
    height: 156,
    borderRadius: 78,
    borderWidth: 1,
    borderColor: colors.halo,
    backgroundColor: colors.primaryTint,
  },
  core: {
    width: 108,
    height: 108,
    borderRadius: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  spark: {
    position: 'absolute',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  sparkA: { top: 18, left: 108, width: 6, height: 6 },
  sparkB: { top: 46, left: 196, width: 5, height: 5 },
  sparkC: { top: 150, left: 28, width: 4, height: 4 },
  sparkD: { top: 168, left: 188, width: 7, height: 7 },
  sparkE: { top: 96, left: 8, width: 4, height: 4 },
  badge: {
    position: 'absolute',
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
  },
});
