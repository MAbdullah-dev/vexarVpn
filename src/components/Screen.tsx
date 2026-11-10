import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Array<'top' | 'bottom'>;
};

export function Screen({ children, style, edges = ['top', 'bottom'] }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        // Safe-area insets are only known at runtime.
        // eslint-disable-next-line react-native/no-inline-styles
        {
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
