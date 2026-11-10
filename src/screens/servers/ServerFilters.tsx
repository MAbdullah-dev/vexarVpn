import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, radius, spacing } from '../../theme';
import { serverFilters, type ServerFilter } from './filterServers';

type Props = {
  active: ServerFilter;
  onChange: (filter: ServerFilter) => void;
};

export function ServerFilters({ active, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}>
      {serverFilters.map(filter => {
        const selected = filter.id === active;
        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`Show ${filter.label}`}
            onPress={() => onChange(filter.id)}
            style={[styles.chip, selected ? styles.chipOn : null]}>
            <Icon
              name={filter.icon}
              size={16}
              filled={selected && filter.id === 'favorites'}
              color={selected ? colors.onPrimary : colors.onSurfaceVariant}
            />
            <AppText
              variant="labelMd"
              color={selected ? colors.onPrimary : colors.onSurfaceVariant}>
              {filter.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: spacing.sm,
    paddingRight: spacing.margin,
  },
  chip: {
    minHeight: spacing.minTouch,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipOn: {
    backgroundColor: colors.primaryContainer,
  },
});
