import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { legalCopy } from '../../constants/legal';
import { colors, radius, spacing } from '../../theme';
import { AppButton } from '../AppButton';
import { AppText } from '../AppText';

type Kind = 'terms' | 'privacy';

type Props = {
  kind: Kind | null;
  onClose: () => void;
};

const content = {
  terms: {
    title: legalCopy.termsTitle,
    body: legalCopy.termsBody,
  },
  privacy: {
    title: legalCopy.privacyTitle,
    body: legalCopy.privacyBody,
  },
} as const;

export function LegalSheet({ kind, onClose }: Props) {
  const page = kind ? content[kind] : null;

  return (
    <Modal
      visible={page !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => undefined}>
          {page ? (
            <View style={styles.copy}>
              <AppText variant="titleLg">{page.title}</AppText>
              <AppText variant="bodyMd" color={colors.onSurfaceVariant}>
                {page.body}
              </AppText>
              <AppButton label="Close" variant="tonal" onPress={onClose} />
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
    padding: spacing.margin,
  },
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainer,
    borderWidth: 1,
    borderColor: colors.outlineGhost,
    padding: spacing.lg,
  },
  copy: {
    gap: spacing.md,
  },
});
