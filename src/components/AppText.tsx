import { Text, type TextProps, type TextStyle } from 'react-native';

import { colors, typeScale, type TypeVariant } from '../theme';

type Props = TextProps & {
  variant?: TypeVariant;
  color?: string;
  tabular?: boolean;
};

export function AppText({
  variant = 'bodyMd',
  color = colors.onSurface,
  tabular = false,
  style,
  ...rest
}: Props) {
  const tabularStyle: TextStyle | undefined = tabular
    ? { fontVariant: ['tabular-nums'] }
    : undefined;

  return (
    <Text
      {...rest}
      style={[typeScale[variant], { color }, tabularStyle, style]}
    />
  );
}
