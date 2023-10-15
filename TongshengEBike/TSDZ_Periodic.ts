import ByteBuffer from 'bytebuffer';

/* eslint-disable no-bitwise */
const NO_ERROR = 0;
const ERROR_MOTOR_BLOCKED = 1;
const ERROR_TORQUE_SENSOR = 2;
const ERROR_LOW_CONTROLLER_VOLTAGE = 6; // controller works with no less than 15 V so give error code if voltage is too low
const ERROR_OVERVOLTAGE = 8;
const ERROR_TEMPERATURE_LIMIT = 9;
const ERROR_TEMPERATURE_MAX = 10;

// size in bytes of the Status/Debug BT notifications
const DEBUG_ADV_SIZE = 16;
const PERIODIC_ADV_SIZE = 37;
const CONFIGURATIONS_ADV_SIZE = 161;
const CONFIGURATIONS_VERSION = 0xa6;

export class TSDZ_Periodic {
  TAG = 'TSDZ_Status';
  pedalCadence: number = 0;
  assistLevel: number = 0;
  assistLevelTarget: number = 0;
  batteryVoltage: number = 0;
  batteryCurrent: number = 0;
  batteryResistanceEstimated: number = 0;
  wheelSpeed: number = 0;
  braking: number = 0;
  light: number = 0;
  motorHallSensors: number = 0;
  PASPedalRight: number = 0;
  ADCThrottle: number = 0;
  motorTemperature: number = 0;
  throttle: number = 0;
  ADCPedalTorqueSensor: number = 0;
  pedalWeightWithOffset: number = 0;
  pedalWeight: number = 0;
  dutyCycle: number = 0;
  motorSpeedERPS: number = 0;
  FOCAngle: number = 0;
  errorStates: number = 0;
  motorCurrent: number = 0;
  ADCBatteryCurrent: number = 0;
  humanPedalPower: number = 0;
  batterySOC: number = 0;
  motorPower: number = 0;
  tripDistance: number = 0;
  tripTime: number = 0;
  odometer: number = 0;
  wattsHour: number = 0;
  motorState: number = 0;
  motorStateTarget: number = 0;
  data: ByteBuffer;

  constructor() {
    this.data = new ByteBuffer(PERIODIC_ADV_SIZE);
  }

  getData(data: ByteBuffer): boolean {
    if (data.buffer.length !== PERIODIC_ADV_SIZE) {
      console.error(this.TAG, 'Wrong Status BT message size!');
      return false;
    }

    this.batteryVoltage =
      (((data.buffer[1] & 255) << 8) + (data.buffer[0] & 255)) / 10;
    this.batteryCurrent = (data.buffer[2] & 255) / 5;
    this.wheelSpeed =
      (((data.buffer[4] & 255) << 8) + (data.buffer[3] & 255)) / 10;
    this.braking = data.buffer[5] & 255 & 1;
    this.light = ((data.buffer[5] & 255) >> 1) & 1;
    this.motorHallSensors = data.buffer[6] & 255;
    this.PASPedalRight = data.buffer[7] & 255;
    this.ADCThrottle = data.buffer[8] & 255;
    this.motorTemperature = data.buffer[9] & 255;
    this.throttle = data.buffer[10] & 255;
    this.ADCPedalTorqueSensor =
      ((data.buffer[12] & 255) << 8) + (data.buffer[11] & 255);
    this.pedalWeightWithOffset = data.buffer[13] & 255;
    this.pedalWeight = data.buffer[14] & 255;
    this.pedalCadence = data.buffer[15] & 255;
    this.dutyCycle = data.buffer[16] & 255;
    this.motorSpeedERPS =
      ((data.buffer[18] & 255) << 8) + (data.buffer[17] & 255);
    this.FOCAngle = data.buffer[19] & 255;
    this.errorStates = data.buffer[20] & 255;
    this.motorCurrent = (data.buffer[21] & 255) / 5;
    this.ADCBatteryCurrent =
      ((data.buffer[23] & 255) << 8) + (data.buffer[22] & 255);
    this.assistLevel = data.buffer[24] & 255;
    this.humanPedalPower =
      ((data.buffer[26] & 255) << 8) + (data.buffer[25] & 255);
    this.batterySOC = data.buffer[27] & 255;
    this.odometer =
      ((data.buffer[31] & 255) << 8) +
      ((data.buffer[30] & 255) << 8) +
      ((data.buffer[29] & 255) << 8) +
      (data.buffer[28] & 255);
    this.wattsHour =
      (((data.buffer[31] & 255) << 8) +
        ((data.buffer[30] & 255) << 8) +
        ((data.buffer[29] & 255) << 8) +
        (data.buffer[28] & 255)) /
      10;
    this.motorState = data.buffer[32] & 255;
    this.motorPower = ((data.buffer[34] & 255) << 8) + (data.buffer[33] & 255);
    this.batteryResistanceEstimated =
      (((data.buffer[36] & 255) << 8) + (data.buffer[35] & 255)) / 1000;

    return true;
  }

  formatData(): ByteBuffer {
    this.data.buffer[0] = this.assistLevelTarget;
    this.data.buffer[1] = this.motorStateTarget;
    return this.data;
  }
}
