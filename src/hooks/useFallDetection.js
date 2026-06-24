import { useCallback, useEffect, useRef, useState } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';

import { FallDetector } from '../utils/fallDetector';
import { magnitude } from '../utils/math';
import {
  DETECTOR_STATE,
  SAMPLE_INTERVAL_MS,
  SENSITIVITY_PRESETS,
} from '../utils/constants';

export function useFallDetection(initialSensitivity = 'medium') {
  const detectorRef = useRef(new FallDetector(SENSITIVITY_PRESETS[initialSensitivity]));

  const lastGyroRef = useRef({ x: 0, y: 0, z: 0 });

  const accSubRef = useRef(null);
  const gyroSubRef = useRef(null);

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [sensitivityKey, setSensitivityKey] = useState(initialSensitivity);
  const [detectorState, setDetectorState] = useState(DETECTOR_STATE.NORMAL);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [accMagnitude, setAccMagnitude] = useState(1);
  const [fallHistory, setFallHistory] = useState([]);

  const handleAccelerometer = useCallback((data) => {
    const timestamp = Date.now();
    const mag = magnitude(data);

    setAcceleration(data);
    setAccMagnitude(mag);

    const { state, fallEvent } = detectorRef.current.processSample({
      accelerometer: data,
      gyroscope: lastGyroRef.current,
      timestamp,
    });

    setDetectorState(state);

    if (fallEvent) {
      setFallHistory((prev) => [
        {
          id: `${fallEvent.timestamp}`,
          time: new Date(fallEvent.timestamp).toLocaleTimeString('pt-BR'),
          impactMagnitude: fallEvent.impactMagnitude,
          rotationConfirmed: fallEvent.rotationConfirmed,
        },
        ...prev,
      ]);
    }
  }, []);

  const start = useCallback(() => {
    if (accSubRef.current) return;

    Accelerometer.setUpdateInterval(SAMPLE_INTERVAL_MS);
    Gyroscope.setUpdateInterval(SAMPLE_INTERVAL_MS);

    gyroSubRef.current = Gyroscope.addListener((data) => {
      lastGyroRef.current = data;
    });
    accSubRef.current = Accelerometer.addListener(handleAccelerometer);

    setIsMonitoring(true);
  }, [handleAccelerometer]);

  const stop = useCallback(() => {
    accSubRef.current?.remove();
    gyroSubRef.current?.remove();
    accSubRef.current = null;
    gyroSubRef.current = null;
    setIsMonitoring(false);
  }, []);

  const dismissFall = useCallback(() => {
    detectorRef.current.reset();
    setDetectorState(DETECTOR_STATE.NORMAL);
  }, []);

  const changeSensitivity = useCallback((key) => {
    if (!SENSITIVITY_PRESETS[key]) return;
    setSensitivityKey(key);
    detectorRef.current.setSensitivity(SENSITIVITY_PRESETS[key]);
  }, []);

  const simulateFall = useCallback(() => {
    const detector = detectorRef.current;
    const now = Date.now();
    const seq = [
      { acc: { x: 0, y: 0.1, z: 0.1 }, gyro: { x: 4, y: 1, z: 0 }, t: now }, // queda livre
      { acc: { x: 0, y: 3.5, z: 1.5 }, gyro: { x: 5, y: 2, z: 1 }, t: now + 200 }, // impacto
    ];
    seq.forEach(({ acc, gyro, t }) =>
      detector.processSample({ accelerometer: acc, gyroscope: gyro, timestamp: t })
    );

    for (let i = 0; i <= 13; i += 1) {
      const t = now + 400 + i * 100;
      const { state, fallEvent } = detector.processSample({
        accelerometer: { x: 0, y: 0, z: 1 },
        gyroscope: { x: 0, y: 0, z: 0 },
        timestamp: t,
      });
      setDetectorState(state);
      if (fallEvent) {
        setFallHistory((prev) => [
          {
            id: `sim-${fallEvent.timestamp}`,
            time: new Date(fallEvent.timestamp).toLocaleTimeString('pt-BR'),
            impactMagnitude: fallEvent.impactMagnitude,
            rotationConfirmed: fallEvent.rotationConfirmed,
            simulated: true,
          },
          ...prev,
        ]);
      }
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return {
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
  };
}
