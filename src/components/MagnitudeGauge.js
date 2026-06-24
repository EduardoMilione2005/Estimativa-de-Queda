import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { round } from '../utils/math';

const MAX_G = 4;

export default function MagnitudeGauge({ value }) {
  const pct = Math.min(value / MAX_G, 1) * 100;

  let barColor = colors.accent;
  if (value > 2.5) barColor = colors.danger;
  else if (value > 1.6 || value < 0.5) barColor = colors.warning;

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{round(value, 2)}</Text>
      <Text style={styles.unit}>g (magnitude da aceleração)</Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.scaleRow}>
        <Text style={styles.scaleLabel}>0</Text>
        <Text style={styles.scaleLabel}>1 (repouso)</Text>
        <Text style={styles.scaleLabel}>{MAX_G}+</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  unit: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  track: {
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.surfaceLight,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 7,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  scaleLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
});
