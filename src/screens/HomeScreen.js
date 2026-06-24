import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import FallAlert from '../components/FallAlert';
import HistoryList from '../components/HistoryList';
import MagnitudeGauge from '../components/MagnitudeGauge';
import SensitivitySelector from '../components/SensitivitySelector';
import SensorReadout from '../components/SensorReadout';
import StatusBadge from '../components/StatusBadge';
import { useFallDetection } from '../hooks/useFallDetection';
import { colors } from '../theme/colors';
import { DETECTOR_STATE } from '../utils/constants';

export default function HomeScreen() {
  const {
    isMonitoring,
    detectorState,
    acceleration,
    accMagnitude,
    sensitivityKey,
    fallHistory,
    start,
    stop,
    dismissFall,
    changeSensitivity,
    simulateFall,
  } = useFallDetection('medium');

  const fallVisible = detectorState === DETECTOR_STATE.FALL_DETECTED;
  const lastFall = fallHistory[0] ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appTitle}>Detector de Quedas</Text>
        <Text style={styles.appSubtitle}>
          Acelerômetro + giroscópio para estimar quedas
        </Text>

        <View style={styles.section}>
          <StatusBadge state={detectorState} monitoring={isMonitoring} />
        </View>

        <MagnitudeGauge value={accMagnitude} />

        <SensorReadout title="Acelerômetro (g)" data={acceleration} />

        <SensitivitySelector
          value={sensitivityKey}
          onChange={changeSensitivity}
          disabled={false}
        />

        <TouchableOpacity
          style={[styles.mainButton, isMonitoring ? styles.stopButton : styles.startButton]}
          onPress={isMonitoring ? stop : start}
        >
          <Text style={styles.mainButtonText}>
            {isMonitoring ? '■  Parar monitoramento' : '▶  Iniciar monitoramento'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.simButton} onPress={simulateFall}>
          <Text style={styles.simButtonText}>Simular queda (teste)</Text>
        </TouchableOpacity>

        <HistoryList items={fallHistory} />

        <Text style={styles.footer}>
          Trabalho de Dispositivos Móveis • Expo + expo-sensors
        </Text>
      </ScrollView>

      <FallAlert visible={fallVisible} fall={lastFall} onDismiss={dismissFall} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
  },
  appSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  section: {
    marginVertical: 4,
  },
  mainButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: colors.accentDark,
  },
  stopButton: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainButtonText: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  simButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  simButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
});
