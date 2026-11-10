import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { Icon } from '../../components/Icon';
import { colors, fonts, radius, spacing } from '../../theme';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
};

export function ServerSearch({ value, onChange, onClear }: Props) {
  return (
    <View style={styles.field}>
      <Icon name="search" size={20} color={colors.outline} />
      <TextInput
        accessibilityLabel="Search sample servers"
        value={value}
        onChangeText={onChange}
        placeholder="Search country or city..."
        placeholderTextColor={colors.outline}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={onClear}
          style={styles.clear}>
          <AppText variant="labelSm" color={colors.primary}>
            Clear
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    minHeight: spacing.minTouch,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: spacing.minTouch,
    color: colors.onSurface,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  clear: {
    minHeight: spacing.minTouch,
    justifyContent: 'center',
    paddingLeft: spacing.sm,
  },
});
