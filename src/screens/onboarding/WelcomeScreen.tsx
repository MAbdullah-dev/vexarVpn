import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { DefenseOrb } from '../../components/onboarding/DefenseOrb';
import { Icon } from '../../components/Icon';
import { LegalSheet } from '../../components/onboarding/LegalSheet';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import { googleSignIn } from '../../services/auth/googleSignIn';
import { useAppStore } from '../../store';
import { colors, fonts, spacing } from '../../theme';
import { DEMO_BUILD_NOTE } from '../../types/vpn';

const features = [
  { icon: 'public', label: 'Sample routes' },
  { icon: 'person', label: 'Guest session' },
  { icon: 'link_off', label: 'No tunnel yet' },
];

export function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Welcome'>>();
  const continueAsGuest = useAppStore(state => state.continueAsGuest);
  const [legal, setLegal] = useState<'terms' | 'privacy' | null>(null);

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.platform}>
          <View style={styles.live} />
          <Icon name="shield" size={16} color={colors.primary} />
          <AppText variant="labelSm" color={colors.onSurfaceVariant} style={styles.platformLabel}>
            VEXRAVPN · DEMO
          </AppText>
        </View>
        <DefenseOrb />
        <AppText variant="headlineLg" style={styles.title}>
          WELCOME TO{'\n'}VEXRAVPN
        </AppText>
        <AppText variant="bodyLg" color={colors.onSurfaceVariant} style={styles.subtitle}>
          {DEMO_BUILD_NOTE}
        </AppText>
        <View style={styles.chips}>
          {features.map(feature => (
            <View key={feature.label} style={styles.chip}>
              <Icon name={feature.icon} size={16} color={colors.primary} />
              <AppText variant="labelMd">{feature.label}</AppText>
            </View>
          ))}
        </View>
        <AppButton
          label="CONTINUE AS GUEST"
          icon="arrow_forward"
          iconPosition="trailing"
          onPress={() => {
            continueAsGuest();
            navigation.navigate('WhyVpn');
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: true }}
          accessibilityHint={googleSignIn.reason}
          disabled
          style={styles.google}>
          <AppText variant="labelLg" color={colors.onSurface}>
            CONTINUE WITH GOOGLE
          </AppText>
        </Pressable>
        <AppText variant="bodySm" color={colors.onSurfaceVariant} style={styles.unavailable}>
          {googleSignIn.reason}
        </AppText>
        <AppText variant="bodySm" color={colors.onSurfaceVariant} style={styles.legal}>
          By continuing, you agree to our{' '}
          <AppText
            variant="bodySm"
            color={colors.primary}
            accessibilityRole="link"
            onPress={() => setLegal('terms')}
            style={styles.link}>
            Terms of Service
          </AppText>{' '}
          and acknowledge our{' '}
          <AppText
            variant="bodySm"
            color={colors.primary}
            accessibilityRole="link"
            onPress={() => setLegal('privacy')}
            style={styles.link}>
            Privacy Policy
          </AppText>
          .
        </AppText>
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
    alignItems: 'center',
    gap: spacing.md,
  },
  platform: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  live: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  platformLabel: {
    letterSpacing: 0.6,
  },
  title: {
    fontFamily: fonts.extraBold,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
  },
  google: {
    alignSelf: 'stretch',
    minHeight: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    opacity: 0.55,
  },
  unavailable: {
    textAlign: 'center',
  },
  legal: {
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
