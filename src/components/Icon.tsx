import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { fonts } from '../theme';

type Props = {
  name: string;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Icon({
  name,
  size = 24,
  color,
  filled = false,
  style,
}: Props) {
  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        styles.icon,
        {
          fontFamily: filled ? fonts.iconsFilled : fonts.icons,
          fontSize: size,
          lineHeight: size + 4,
          color,
        },
        style,
      ]}>
      {name}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    includeFontPadding: false,
  },
});
