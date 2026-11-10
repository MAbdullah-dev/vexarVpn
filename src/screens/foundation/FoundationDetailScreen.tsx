import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton, AppText, Screen } from '../../components';
import type { RootStackParamList } from '../../navigation/types';
import { colors, spacing } from '../../theme';

export function FoundationDetailScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen>
      <View style={styles.content}>
        <AppText variant="labelMd" color={colors.primary}>
          VEXRAVPN
        </AppText>
        <AppText variant="headlineSm">Stack navigation</AppText>
        <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
          The native stack accepted this route and can return to the foundation
          screen.
        </AppText>
        <AppButton
          label="Back"
          icon="arrow_back"
          variant="outlined"
          onPress={() => navigation.goBack()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: spacing.margin,
    gap: spacing.md,
    justifyContent: 'center',
  },
});
