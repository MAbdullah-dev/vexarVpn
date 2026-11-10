import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { InfoRow } from '../../components/onboarding/InfoRow';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { Screen } from '../../components/Screen';
import { openMainApp } from '../../navigation/onboarding';
import type { RootStackParamList } from '../../navigation/types';
import { colors, radius, spacing } from '../../theme';
import { DEMO_BUILD_NOTE } from '../../types/vpn';

const cards = [
  {
    icon: 'vpn_key',
    title: 'What a connected VPN can do',
    body: 'A connected VPN encrypts traffic between a device and a VPN server. This demo is not connected.',
  },
  {
    icon: 'public_off',
    title: 'What this demo does',
    body: 'It stores a guest session, a sample server choice, and a simulated connection state on this device.',
  },
  {
    icon: 'wifi_protected_setup',
    title: 'What this demo does not do',
    body: DEMO_BUILD_NOTE,
  },
];

export function WhyVpnScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'WhyVpn'>>();
  const skip = () => openMainApp(navigation);

  return (
    <Screen>
      <OnboardingHeader step={1} onBack={() => navigation.goBack()} onSkip={skip} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.diagram}>
          <View style={styles.phone}>
            <Icon name="verified_user" size={36} color={colors.primary} />
            <AppText variant="labelSm" color={colors.primary} style={styles.center}>
              VEXRAVPN
            </AppText>
            <AppText variant="labelSm" color={colors.primary}>
              DEMO
            </AppText>
          </View>
          <View style={styles.linkDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <View style={styles.side}>
            <View style={styles.mini}>
              <Icon name="lock" size={18} color={colors.primary} />
              <AppText variant="labelSm" style={styles.center}>
                SAMPLE
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                LAYOUT
              </AppText>
            </View>
            <View style={styles.mini}>
              <Icon name="dns" size={18} color={colors.primary} />
              <AppText variant="labelSm" style={styles.center}>
                ROUTES
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                6 SAMPLE
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.diagramMeta}>
          <AppText variant="labelSm" color={colors.onSurfaceVariant}>
            DEMO LAYOUT
          </AppText>
          <AppText variant="labelSm" color={colors.primary}>
            NOT A LIVE TUNNEL
          </AppText>
        </View>
        <AppText variant="headlineSm">A more private way to connect</AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          {DEMO_BUILD_NOTE} A connected VPN can encrypt traffic between a device
          and a VPN server. This build only simulates that state.
        </AppText>
        {cards.map(card => (
          <InfoRow key={card.title} {...card} />
        ))}
        <AppButton
          label="CONTINUE"
          icon="arrow_forward"
          iconPosition="trailing"
          onPress={() => navigation.navigate('Privacy')}
        />
        <AppButton label="Skip introduction" variant="text" onPress={skip} />
      </ScrollView>
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
  diagram: {
    minHeight: 168,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  phone: {
    width: 108,
    height: 148,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  linkDots: {
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryContainer,
  },
  side: {
    flex: 1,
    gap: spacing.sm,
  },
  mini: {
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.sm,
    alignItems: 'center',
  },
  center: {
    textAlign: 'center',
  },
  diagramMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
