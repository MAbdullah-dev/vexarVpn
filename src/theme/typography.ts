import type { TextStyle } from 'react-native';

export const fonts = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extraBold: 'PlusJakartaSans-ExtraBold',
  icons: 'MaterialSymbolsOutlined',
  iconsFilled: 'MaterialSymbolsFilled',
} as const;

export const typeScale = {
  display: {
    fontFamily: fonts.bold,
    fontSize: 44,
    lineHeight: 52,
    letterSpacing: -0.2,
  },
  headlineLg: {
    fontFamily: fonts.semibold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMd: {
    fontFamily: fonts.semibold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSm: {
    fontFamily: fonts.semibold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  titleLg: {
    fontFamily: fonts.medium,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMd: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSm: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bodyLg: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMd: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySm: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  labelLg: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMd: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSm: {
    fontFamily: fonts.medium,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof typeScale;
