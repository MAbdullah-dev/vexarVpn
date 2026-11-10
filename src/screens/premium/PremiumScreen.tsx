import { useCallback, useEffect, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { Screen } from '../../components/Screen';
import { LegalSheet } from '../../components/onboarding/LegalSheet';
import {
  billingDisconnectedNote,
  defaultPlanId,
  illustrativePricingNote,
  premiumBenefits,
  purchaseCtaLabel,
  purchaseUnavailableNotice,
  restoreUnavailableNotice,
  subscriptionPlans,
  type PlanId,
} from '../../constants/premium';
import { billingState } from '../../services/billing/billing';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing } from '../../theme';
import { PlanCard } from './PlanCard';
import { PremiumHero } from './PremiumHero';
import { premiumHardwareBack } from './premiumBack';

const trustMarks = [
  { icon: 'lock_reset', label: 'Planned cipher' },
  { icon: 'bolt', label: 'Not measured' },
  { icon: 'thumb_up', label: 'No trial yet' },
] as const;

export function PremiumScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [planId, setPlanId] = useState<PlanId>(defaultPlanId);
  const [notice, setNotice] = useState<string | null>(null);
  const [legal, setLegal] = useState<'terms' | 'privacy' | null>(null);
  const cta = purchaseCtaLabel(planId);

  const leave = useCallback(() => {
    const action = premiumHardwareBack({
      legalOpen: legal !== null,
      canGoBack: navigation.canGoBack(),
    });
    if (action === 'close-legal') {
      setLegal(null);
      return true;
    }
    if (action === 'previous') {
      navigation.goBack();
      return true;
    }
    navigation.navigate('Home');
    return true;
  }, [legal, navigation]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', leave);
    return () => subscription.remove();
  }, [leave]);

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={leave}
          style={styles.back}>
          <Icon name="arrow_back" size={20} color={colors.onSurface} />
        </Pressable>
        <View style={styles.brand}>
          <Icon name="shield" size={22} filled color={colors.primary} />
          <AppText variant="titleMd">Premium Subscription</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => navigation.navigate('Profile')}
          style={styles.back}>
          <Icon name="shield_person" size={20} color={colors.onSurfaceVariant} />
        </Pressable>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {notice ? (
          <View style={styles.notice}>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              {notice}
            </AppText>
          </View>
        ) : null}
        <PremiumHero />
        <View style={styles.benefits}>
          <View style={styles.benefitHead}>
            <AppText variant="labelLg" color={colors.onSurfaceVariant}>
              Planned with VIP passes
            </AppText>
            <AppText variant="labelSm" color={colors.primary}>
              Not included yet
            </AppText>
          </View>
          {premiumBenefits.map(benefit => (
            <View key={benefit.title} style={styles.benefit}>
              <View style={styles.check}>
                <Icon name="check" size={16} color={colors.primary} />
              </View>
              <View style={styles.benefitCopy}>
                <AppText variant="bodyMd">{benefit.title}</AppText>
                <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                  {benefit.detail}
                </AppText>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.planHead}>
          <AppText variant="titleSm">Choose Access Plan</AppText>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            Demo prices
          </AppText>
        </View>
        <AppText variant="bodySm" color={colors.onSurfaceVariant}>
          {illustrativePricingNote}
        </AppText>
        {subscriptionPlans.map(plan => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={plan.id === planId}
            onSelect={setPlanId}
          />
        ))}
        <View style={styles.trust}>
          {trustMarks.map(mark => (
            <View key={mark.label} style={styles.trustItem}>
              <Icon name={mark.icon} size={20} color={colors.primary} />
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                {mark.label}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="bodySm" color={colors.onSurfaceVariant} style={styles.center}>
          Purchases and trials are unavailable in this demo.
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${cta}. Purchases are not available.`}
          onPress={() => {
            if (!billingState.purchasesEnabled && !billingState.trialsEnabled) {
              setNotice(purchaseUnavailableNotice);
            }
          }}
          style={styles.cta}>
          <Icon name="bolt" size={22} color={colors.onPrimary} />
          <AppText variant="labelLg" color={colors.onPrimary}>
            {cta}
          </AppText>
        </Pressable>
        <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.center}>
          {billingDisconnectedNote}
        </AppText>
        <View style={styles.links}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Restore purchases"
            onPress={() => {
              if (!billingState.restoreEnabled) {
                setNotice(restoreUnavailableNotice);
              }
            }}
            style={styles.link}>
            <AppText variant="labelSm" color={colors.primary}>
              Restore Purchases
            </AppText>
          </Pressable>
          <AppText variant="labelSm" color={colors.outline}>
            •
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Terms of service"
            onPress={() => setLegal('terms')}
            style={styles.link}>
            <AppText variant="labelSm" color={colors.primary}>
              Terms of Service
            </AppText>
          </Pressable>
          <AppText variant="labelSm" color={colors.outline}>
            •
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Privacy policy"
            onPress={() => setLegal('privacy')}
            style={styles.link}>
            <AppText variant="labelSm" color={colors.primary}>
              Privacy Policy
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
      <LegalSheet kind={legal} onClose={() => setLegal(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
  },
  back: {
    width: spacing.minTouch,
    height: spacing.minTouch,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  notice: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.md,
  },
  benefits: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    gap: spacing.md,
  },
  benefitHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCopy: {
    flex: 1,
    gap: 2,
  },
  planHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trust: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  center: {
    textAlign: 'center',
  },
  cta: {
    minHeight: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  link: {
    minHeight: spacing.minTouch,
    justifyContent: 'center',
  },
});
