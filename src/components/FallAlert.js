import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

import { colors } from '../theme/colors';
import { round } from '../utils/math';

const COUNTDOWN_SECONDS = 10;

export default function FallAlert({ visible, fall, onDismiss }) {
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [emergencyTriggered, setEmergencyTriggered] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSeconds(COUNTDOWN_SECONDS);
      setEmergencyTriggered(false);
      return undefined;
    }

    Vibration.vibrate([0, 400, 200, 400], false);

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          setEmergencyTriggered(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      Vibration.cancel();
    };
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.icon}>⚠️</Text>
          <Text style={styles.title}>QUEDA DETECTADA</Text>

          {fall && (
            <Text style={styles.detail}>
              Impacto: {round(fall.impactMagnitude, 1)} g
              {fall.rotationConfirmed ? '  •  rotação confirmada' : ''}
            </Text>
          )}

          {!emergencyTriggered ? (
            <>
              <Text style={styles.countdownLabel}>
                Enviando alerta de emergência em
              </Text>
              <Text style={styles.countdown}>{seconds}s</Text>
              <Text style={styles.hint}>
                Toque abaixo se você estiver bem para cancelar.
              </Text>
            </>
          ) : (
            <Text style={styles.emergency}>
              🚨 Alerta de emergência enviado (simulação).
            </Text>
          )}

          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Estou bem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.danger,
  },
  icon: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.danger,
    letterSpacing: 1,
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  countdownLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  countdown: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.textPrimary,
    marginVertical: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  emergency: {
    fontSize: 15,
    color: colors.warning,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.normal,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#06210F',
    fontSize: 18,
    fontWeight: '800',
  },
});
