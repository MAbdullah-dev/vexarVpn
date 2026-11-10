import { Image, StyleSheet, View } from 'react-native';

import { images } from '../../assets/images';
import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, radius, spacing } from '../../theme';

const gallery = [
  {
    source: images.premiumRamPods,
    title: '10Gbps RAM pods',
    detail: 'Planned. Not in this demo.',
  },
  {
    source: images.premiumMultihop,
    title: 'Multi-hop routing',
    detail: 'Planned. Not in this demo.',
  },
] as const;

export function PremiumHero() {
  return (
    <View style={styles.wrap}>
      <View style={styles.emblem}>
        <View style={styles.orbitOuter} />
        <View style={styles.orbitInner} />
        <View style={styles.core}>
          <View style={styles.vip}>
            <AppText variant="labelSm" color={colors.onPrimary}>
              VIP
            </AppText>
          </View>
          <Icon name="security" size={34} filled color={colors.primary} />
        </View>
      </View>
      <View style={styles.kicker}>
        <Icon name="workspace_premium" size={15} filled color={colors.primary} />
        <AppText variant="labelSm" color={colors.primary}>
          PLANNED PREMIUM
        </AppText>
      </View>
      <AppText variant="headlineLg" style={styles.center}>
        VEXRAVPN Premium
      </AppText>
      <AppText
        variant="bodyMd"
        color={colors.onSurfaceVariant}
        style={styles.center}>
        Illustrative plans for a future subscription. This demo does not unlock
        locations, bandwidth, or a tunnel.
      </AppText>
      <View style={styles.gallery}>
        {gallery.map(item => (
          <View key={item.title} style={styles.tile}>
            <Image source={item.source} style={styles.image} />
            <View style={styles.tileCopy}>
              <AppText variant="labelSm" color={colors.primary}>
                {item.title}
              </AppText>
              <AppText variant="labelSm" color={colors.onSurfaceVariant}>
                {item.detail}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  emblem: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitOuter: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 1,
    borderColor: colors.tertiaryContainer,
    borderStyle: 'dashed',
  },
  orbitInner: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },
  core: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vip: {
    position: 'absolute',
    top: -6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
  },
  kicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
  },
  center: {
    textAlign: 'center',
  },
  gallery: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tile: {
    flex: 1,
    height: 96,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tileCopy: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.sm,
    gap: 2,
    backgroundColor: colors.scrim,
  },
});
