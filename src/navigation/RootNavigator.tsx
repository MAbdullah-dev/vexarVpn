import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { FoundationDetailScreen } from '../screens/foundation/FoundationDetailScreen';
import { FoundationScreen } from '../screens/foundation/FoundationScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ServerExplorerScreen } from '../screens/servers/ServerExplorerScreen';
import { PremiumScreen } from '../screens/premium/PremiumScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SpeedTestScreen } from '../screens/speed/SpeedTestScreen';
import { PrivacyScreen } from '../screens/onboarding/PrivacyScreen';
import { SplashScreen } from '../screens/onboarding/SplashScreen';
import { VpnPermissionScreen } from '../screens/onboarding/VpnPermissionScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { WhyVpnScreen } from '../screens/onboarding/WhyVpnScreen';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surfaceContainer,
    text: colors.onSurface,
    border: colors.outlineVariant,
    primary: colors.primaryContainer,
    notification: colors.error,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="WhyVpn" component={WhyVpnScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="VpnPermission" component={VpnPermissionScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Servers" component={ServerExplorerScreen} />
        <Stack.Screen name="Speed" component={SpeedTestScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} />
        <Stack.Screen name="Foundation" component={FoundationScreen} />
        <Stack.Screen
          name="FoundationDetail"
          component={FoundationDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
