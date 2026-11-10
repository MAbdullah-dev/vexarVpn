import { Pressable, StyleSheet, View } from 'react-native';

import { colors, elevation, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

export type TabKey = 'home' | 'servers' | 'speed' | 'profile';

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'shield' },
  { key: 'servers', label: 'Servers', icon: 'public' },
  { key: 'speed', label: 'Speed', icon: 'speed' },
  { key: 'profile', label: 'Profile', icon: 'shield_person' },
];

type Props = {
  active: TabKey;
  onChange: (key: TabKey) => void;
  unavailable?: readonly TabKey[];
};

export function FloatingTabBar({ active, onChange, unavailable = [] }: Props) {
  return (
    <View style={styles.frame}>
      <View style={styles.bar}>
        {tabs.map(tab => {
          const selected = tab.key === active;
          const later = unavailable.includes(tab.key);
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={
                later ? `${tab.label}, not available in this stage` : tab.label
              }
              onPress={() => onChange(tab.key)}
              style={[styles.tab, selected ? styles.tabActive : null]}>
              <Icon
                name={tab.icon}
                size={22}
                filled={selected}
                color={selected ? colors.primaryContainer : colors.outline}
              />
              <AppText
                variant="labelSm"
                color={selected ? colors.primaryContainer : colors.outline}>
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.sm,
  },
  bar: {
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...elevation.bar,
  },
  tab: {
    flex: 1,
    height: spacing.minTouch,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  tabActive: {
    backgroundColor: colors.primaryTint,
    shadowColor: colors.primaryContainer,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
});
