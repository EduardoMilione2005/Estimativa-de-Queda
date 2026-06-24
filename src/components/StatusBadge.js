import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { DETECTOR_STATE } from '../utils/constants';

const STATE_INFO = {
  [DETECTOR_STATE.NORMAL]: { label: 'Normal', color: colors.normal },
  [DETECTOR_STATE.FREE_FALL]: { label: 'Possível queda livre…', color: colors.warning },
  [DETECTOR_STATE.IMPACT]: { label: 'Impacto detectado…', color: colors.warning },
  [DETECTOR_STATE.FALL_DETECTED]: { label: 'QUEDA DETECTADA', color: colors.danger },
};

export default function StatusBadge({ state, monitoring }) {
  const info = monitoring
    ? STATE_INFO[state]
    : { label: 'Parado', color: colors.textMuted };

  return (
    <View style={[styles.badge, { borderColor: info.color }]}>
      <View style={[styles.dot, { backgroundColor: info.color }]} />
      <Text style={[styles.label, { color: info.color }]}>{info.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
