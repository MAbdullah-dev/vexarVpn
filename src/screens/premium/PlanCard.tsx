import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import type { SubscriptionPlan } from '../../constants/premium';
import { colors, radius, spacing } from '../../theme';

type Props = {
  plan: SubscriptionPlan;
  selected: boolean;
  onSelect: (id: SubscriptionPlan['id']) => void;
};

export function PlanCard({ plan, selected, onSelect }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`Select ${plan.title}. Illustrative price ${plan.price} ${plan.period}`}
      onPress={() => onSelect(plan.id)}
      style={[styles.card, selected ? styles.cardOn : null]}>
      <View style={styles.titleRow}>
        <View style={styles.title}>
          {plan.featured ? (
            <Icon name="star" size={18} filled color={colors.primary} />
          ) : null}
          <AppText variant="titleMd">{plan.title}</AppText>
        </View>
        <View style={[styles.badge, plan.featured ? styles.badgeOn : null]}>
          <AppText
            variant="labelSm"
            color={
              plan.featured
                ? colors.onPrimary
                : plan.id === 'week'
                  ? colors.tertiary
                  : colors.onSurfaceVariant
            }>
            {plan.badge}
          </AppText>
        </View>
      </View>
      <View style={styles.priceRow}>
        <View style={styles.priceCopy}>
          <View style={styles.priceLine}>
            <AppText
              variant={plan.featured ? 'headlineMd' : 'titleLg'}
              color={plan.featured ? colors.primary : colors.onSurface}>
              {plan.price}
            </AppText>
            <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
              {plan.period}
            </AppText>
          </View>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            {plan.detail}
          </AppText>
        </View>
        <View style={[styles.radio, selected ? styles.radioOn : null]}>
          {selected ? (
            <Icon name="check" size={16} color={colors.onPrimary} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 88,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardOn: {
    backgroundColor: colors.surfaceContainerHigh,
    borderColor: colors.primaryContainer,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
  },
  badgeOn: {
    backgroundColor: colors.primaryContainer,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  priceCopy: {
    flex: 1,
    gap: 2,
  },
  priceLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: colors.primary,
  },
});
