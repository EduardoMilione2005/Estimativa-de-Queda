export const SAMPLE_INTERVAL_MS = 50;

export const SENSITIVITY_PRESETS = {
  low: {
    freeFall: 0.45,
    impact: 3.0,
    label: 'Baixa',
  },
  medium: {
    freeFall: 0.55,
    impact: 2.5,
    label: 'Média',
  },
  high: {
    freeFall: 0.65,
    impact: 2.0,
    label: 'Alta',
  },
};

export const THRESHOLDS = {
  FREE_FALL_TO_IMPACT_WINDOW: 800,
  STILLNESS_TOLERANCE: 0.25,
  STILLNESS_DURATION: 1200,
  GYRO_ROTATION: 3.5,
  EVENT_TIMEOUT: 2500,
};

export const DETECTOR_STATE = {
  NORMAL: 'NORMAL',
  FREE_FALL: 'FREE_FALL',
  IMPACT: 'IMPACT',
  FALL_DETECTED: 'FALL_DETECTED',
};
