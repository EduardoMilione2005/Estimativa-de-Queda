import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../theme/colors';
import { SENSITIVITY_PRESETS } from '../utils/constants';

export default function SensitivitySelector({ value, onChange, disabled }) {
  const keys = Object.keys(SENSITIVITY_PRESETS);

  return (
    <View>
      <Text style={styles.label}>Sensibilidade</Text>
      <View style={styles.row}>
        {keys.map((key) => {
          const active = key === value;
          return (
            <TouchableOpacity
              key={key}
              disabled={disabled}
              onPress={() => onChange(key)}
              style={[
                styles.option,
                active && styles.optionActive,
                disabled && styles.optionDisabled,
              ]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {SENSITIVITY_PRESETS[key].label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  optionTextActive: {
    color: colors.textPrimary,
  },
});
