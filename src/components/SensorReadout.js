import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { round } from '../utils/math';

function Axis({ label, value }) {
  return (
    <View style={styles.axis}>
      <Text style={styles.axisLabel}>{label}</Text>
      <Text style={styles.axisValue}>{round(value, 3)}</Text>
    </View>
  );
}

export default function SensorReadout({ title, data }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Axis label="X" value={data.x} />
        <Axis label="Y" value={data.y} />
        <Axis label="Z" value={data.z} />
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  axis: {
    alignItems: 'center',
  },
  axisLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  axisValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});
