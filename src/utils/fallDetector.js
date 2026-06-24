import { DETECTOR_STATE, THRESHOLDS } from './constants';
import { magnitude } from './math';

export class FallDetector {
  /**
   * @param {object} sensitivity preset de sensibilidade { freeFall, impact }
   */
  constructor(sensitivity) {
    this.sensitivity = sensitivity;
    this.reset();
  }

  setSensitivity(sensitivity) {
    this.sensitivity = sensitivity;
  }

  reset() {
    this.state = DETECTOR_STATE.NORMAL;
    this.freeFallStartTime = null;
    this.impactTime = null;
    this.stillnessStartTime = null;
    this.rotationConfirmed = false;
    this.lastImpactMagnitude = 0;
  }

  _isStill(accMagnitude) {
    return Math.abs(accMagnitude - 1) <= THRESHOLDS.STILLNESS_TOLERANCE;
  }

  /**
   * @param {object} sample,
   * @param {{x,y,z}} sample.accelerometer, 
   * @param {{x,y,z}|null} sample.gyroscope, 
   * @param {number} sample.timestamp 
   * @returns {{ state:string, fallEvent:object|null }}
   */
  processSample({ accelerometer, gyroscope, timestamp }) {
    const accMag = magnitude(accelerometer);
    const gyroMag = gyroscope ? magnitude(gyroscope) : 0;

    let fallEvent = null;

    if (gyroMag >= THRESHOLDS.GYRO_ROTATION && this.state !== DETECTOR_STATE.NORMAL) {
      this.rotationConfirmed = true;
    }

    switch (this.state) {
      case DETECTOR_STATE.NORMAL: {
        if (accMag < this.sensitivity.freeFall) {
          this.state = DETECTOR_STATE.FREE_FALL;
          this.freeFallStartTime = timestamp;
          this.rotationConfirmed = gyroMag >= THRESHOLDS.GYRO_ROTATION;
        }
        break;
      }

      case DETECTOR_STATE.FREE_FALL: {
        const elapsed = timestamp - this.freeFallStartTime;

        if (elapsed > THRESHOLDS.FREE_FALL_TO_IMPACT_WINDOW) {
          this.reset();
          break;
        }

        if (accMag > this.sensitivity.impact) {
          this.state = DETECTOR_STATE.IMPACT;
          this.impactTime = timestamp;
          this.lastImpactMagnitude = accMag;
          this.stillnessStartTime = null;
        }
        break;
      }

      case DETECTOR_STATE.IMPACT: {
        const sinceImpact = timestamp - this.impactTime;

        if (sinceImpact > THRESHOLDS.EVENT_TIMEOUT) {
          this.reset();
          break;
        }

        if (this._isStill(accMag)) {
          if (this.stillnessStartTime === null) {
            this.stillnessStartTime = timestamp;
          }

          const stillFor = timestamp - this.stillnessStartTime;
          if (stillFor >= THRESHOLDS.STILLNESS_DURATION) {
            this.state = DETECTOR_STATE.FALL_DETECTED;
            fallEvent = {
              timestamp,
              impactMagnitude: this.lastImpactMagnitude,
              rotationConfirmed: this.rotationConfirmed,
            };
          }
        } else {
          this.stillnessStartTime = null;
        }
        break;
      }

      // ---------------------------------------------------------------
      case DETECTOR_STATE.FALL_DETECTED: {
        break;
      }

      default:
        this.reset();
    }

    return { state: this.state, fallEvent };
  }
}
