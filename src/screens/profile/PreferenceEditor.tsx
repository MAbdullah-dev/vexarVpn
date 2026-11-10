import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '../../components/AppText';
import { colors, radius, spacing } from '../../theme';
import type { Choice } from './profileModel';

type ChoiceProps<T extends string> = {
  title: string;
  body: string;
  choices: readonly Choice<T>[];
  selected: T;
  onSelect: (id: T) => void;
  onBack: () => void;
};

type NameProps = {
  title: string;
  body: string;
  names: readonly string[];
  empty: string;
  inputLabel: string;
  addLabel: string;
  onAdd: (raw: string) => boolean;
  onRemove: (name: string) => void;
  onBack: () => void;
};

export function ChoiceEditor<T extends string>({
  title,
  body,
  choices,
  selected,
  onSelect,
  onBack,
}: ChoiceProps<T>) {
  return (
    <View style={styles.wrap}>
      <AppText variant="headlineMd">{title}</AppText>
      <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
        {body}
      </AppText>
      {choices.map(choice => {
        const active = choice.id === selected;
        return (
          <Pressable
            key={choice.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Select ${choice.title}`}
            onPress={() => onSelect(choice.id)}
            style={[styles.choice, active ? styles.choiceOn : null]}>
            <AppText variant="titleSm">{choice.title}</AppText>
            <AppText variant="bodySm" color={colors.onSurfaceVariant}>
              {choice.subtitle}
            </AppText>
          </Pressable>
        );
      })}
      <BackButton onPress={onBack} />
    </View>
  );
}

export function NameEditor({
  title,
  body,
  names,
  empty,
  inputLabel,
  addLabel,
  onAdd,
  onRemove,
  onBack,
}: NameProps) {
  const [draft, setDraft] = useState('');

  return (
    <View style={styles.wrap}>
      <AppText variant="headlineMd">{title}</AppText>
      <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
        {body}
      </AppText>
      <TextInput
        accessibilityLabel={inputLabel}
        value={draft}
        onChangeText={setDraft}
        placeholder="Name"
        placeholderTextColor={colors.outline}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={addLabel}
        onPress={() => {
          if (onAdd(draft)) {
            setDraft('');
          }
        }}
        style={styles.add}>
        <AppText variant="labelLg" color={colors.onPrimary}>
          Add
        </AppText>
      </Pressable>
      {names.length === 0 ? (
        <AppText variant="bodySm" color={colors.onSurfaceVariant}>
          {empty}
        </AppText>
      ) : (
        names.map(name => (
          <View key={name} style={styles.nameRow}>
            <AppText variant="bodyMd" style={styles.name}>
              {name}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove ${name}`}
              onPress={() => onRemove(name)}
              style={styles.remove}>
              <AppText variant="labelLg" color={colors.error}>
                Remove
              </AppText>
            </Pressable>
          </View>
        ))
      )}
      <BackButton onPress={onBack} />
    </View>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back to profile"
      onPress={onPress}
      style={styles.back}>
      <AppText variant="labelLg" color={colors.onPrimary}>
        Back to profile
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.md,
  },
  choice: {
    minHeight: spacing.minTouch,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.md,
    gap: spacing.xs,
  },
  choiceOn: {
    borderColor: colors.primaryContainer,
  },
  input: {
    minHeight: spacing.minTouch,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    color: colors.onSurface,
    paddingHorizontal: spacing.md,
  },
  add: {
    minHeight: spacing.minTouch,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    minHeight: spacing.minTouch,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    flex: 1,
  },
  remove: {
    minHeight: spacing.minTouch,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  back: {
    minHeight: spacing.minTouch,
    borderRadius: radius.full,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
