import type { ImageSourcePropType } from 'react-native';

export const images = {
  shieldLogo: require('./shield-logo.png'),
  profileAvatar: require('./profile-avatar.png'),
  premiumRamPods: require('./premium-ram-pods.png'),
  premiumMultihop: require('./premium-multihop.png'),
  flagDeScene: require('./flag-de-scene.png'),
  flagDeRound: require('./flag-de-round.png'),
  flagDeBadge: require('./flag-de-badge.png'),
  flagNlRound: require('./flag-nl-round.png'),
  flagNlToken: require('./flag-nl-token.png'),
  flagUs: require('./flag-us.png'),
  flagGb: require('./flag-gb.png'),
  flagJp: require('./flag-jp.png'),
  flagSg: require('./flag-sg.png'),
} as const satisfies Record<string, ImageSourcePropType>;

export const flagImages = {
  de: images.flagDeRound,
  nl: images.flagNlRound,
  us: images.flagUs,
  gb: images.flagGb,
  jp: images.flagJp,
  sg: images.flagSg,
} as const satisfies Record<string, ImageSourcePropType>;

export type FlagCode = keyof typeof flagImages;
