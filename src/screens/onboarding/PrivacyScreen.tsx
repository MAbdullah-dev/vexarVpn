import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { InfoRow } from '../../components/onboarding/InfoRow';
import { LegalSheet } from '../../components/onboarding/LegalSheet';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { Screen } from '../../components/Screen';
import { openMainApp } from '../../navigation/onboarding';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing } from '../../theme';
import { DEMO_BUILD_NOTE } from '../../types/vpn';

const notes = [
  {
    icon: 'verified_user',
    title: 'What a connected VPN can do',
    body: 'A connected VPN encrypts traffic between a device and a VPN server. This demo is not connected.',
  },
  {
    icon: 'gpp_maybe',
    title: 'What this demo does not do',
    body: DEMO_BUILD_NOTE,
  },
  {
    icon: 'policy',
    title: 'How your data is handled',
    body: 'Review the privacy note for what this build stores on the device, and for what a VPN still cannot hide.',
  },
];

export function PrivacyScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Privacy'>>();
  const [open, setOpen] = useState(false);
  const [legal, setLegal] = useState<'privacy' | null>(null);
  const skip = () => openMainApp(navigation);

  return (
    <Screen>
      <OnboardingHeader step={2} onBack={() => navigation.goBack()} onSkip={skip} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.globe}>
          <View style={styles.orbit} />
          <View style={styles.orbitInner} />
          <View style={styles.meridian} />
          <View style={styles.badge}>
            <View style={styles.dot} />
            <AppText variant="labelSm" color={colors.primary}>
              DEMO NOTES
            </AppText>
          </View>
        </View>
        <AppText variant="headlineSm">Your privacy deserves clarity</AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          {DEMO_BUILD_NOTE} The notes below describe a VPN in general and what
          this build stores on the device.
        </AppText>
        {notes.map(note => (
          <InfoRow key={note.title} {...note} />
        ))}
        <Pressable
          accessibilityRole="link"
          onPress={() => setLegal('privacy')}
          style={styles.policy}>
          <AppText variant="labelLg" color={colors.primary}>
            READ FULL PRIVACY POLICY
          </AppText>
          <Icon name="arrow_forward" size={18} color={colors.primary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          onPress={() => setOpen(value => !value)}
          style={styles.expand}>
          <Icon name="info" size={18} color={colors.primary} />
          <AppText variant="titleSm" style={styles.expandTitle}>
            Learn more about VPN privacy
          </AppText>
          <Icon
            name={open ? 'expand_less' : 'expand_more'}
            size={20}
            color={colors.onSurfaceVariant}
          />
        </Pressable>
        {open ? (
          <AppText variant="bodySm" color={colors.onSurfaceVariant}>
            When a VPN is connected, your internet provider and other people on
            the local network generally cannot read the sites you visit or the
            contents of that traffic. Signing in to a website or app can still
            identify you to that service. This build does not claim an
            independent no-logs audit, and Android VPN permission alone does not
            start a tunnel.
          </AppText>
        ) : null}
        <AppButton
          label="CONTINUE"
          onPress={() => navigation.navigate('VpnPermission')}
        />
      </ScrollView>
      <LegalSheet kind={legal} onClose={() => setLegal(null)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  globe: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbit: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: colors.halo,
  },
  orbitInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
    backgroundColor: colors.primaryTint,
  },
  meridian: {
    position: 'absolute',
    width: 70,
    height: 150,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  badge: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
  },
  policy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  expand: {
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  expandTitle: {
    flex: 1,
  },
});
