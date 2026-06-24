import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { round } from '../utils/math';

export default function HistoryList({ items }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de quedas</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Nenhuma queda registrada nesta sessão.</Text>
      ) : (
        items.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTime}>
                {item.time}
                {item.simulated ? '  (simulada)' : ''}
              </Text>
              <Text style={styles.itemDetail}>
                Impacto {round(item.impactMagnitude, 1)} g
                {item.rotationConfirmed ? '  •  rotação confirmada' : ''}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    marginRight: 12,
  },
  itemTime: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemDetail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
