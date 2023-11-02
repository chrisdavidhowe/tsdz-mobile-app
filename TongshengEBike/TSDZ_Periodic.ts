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
  data: number[];

  constructor() {
    this.data = new Array<number>(PERIODIC_ADV_SIZE);
  }

  getData(data: number[]): boolean {
    this.data = data;
    if (data.length !== PERIODIC_ADV_SIZE) {
      console.error(this.TAG, 'Wrong Status BT message size!');
      return false;
    }

    this.batteryVoltage = (((data[1] & 255) << 8) + (data[0] & 255)) / 10;
    this.batteryCurrent = (data[2] & 255) / 5;
    this.wheelSpeed = (((data[4] & 255) << 8) + (data[3] & 255)) / 10;
    this.braking = data[5] & 255 & 1;
    this.light = ((data[5] & 255) >> 1) & 1;
    this.motorHallSensors = data[6] & 255;
    this.PASPedalRight = data[7] & 255;
    this.ADCThrottle = data[8] & 255;
    this.motorTemperature = data[9] & 255;
    this.throttle = data[10] & 255;
    this.ADCPedalTorqueSensor = ((data[12] & 255) << 8) + (data[11] & 255);
    this.pedalWeightWithOffset = data[13] & 255;
    this.pedalWeight = data[14] & 255;
    this.pedalCadence = data[15] & 255;
    this.dutyCycle = data[16] & 255;
    this.motorSpeedERPS = ((data[18] & 255) << 8) + (data[17] & 255);
    this.FOCAngle = data[19] & 255;
    this.errorStates = data[20] & 255;
    this.motorCurrent = (data[21] & 255) / 5;
    this.ADCBatteryCurrent = ((data[23] & 255) << 8) + (data[22] & 255);
    this.assistLevel = data[24] & 255;
    this.humanPedalPower = ((data[26] & 255) << 8) + (data[25] & 255);
    this.batterySOC = data[27] & 255;
    this.odometer =
      ((data[31] & 255) << 8) +
      ((data[30] & 255) << 8) +
      ((data[29] & 255) << 8) +
      (data[28] & 255);
    this.wattsHour =
      (((data[31] & 255) << 8) +
        ((data[30] & 255) << 8) +
        ((data[29] & 255) << 8) +
        (data[28] & 255)) /
      10;
    this.motorState = data[32] & 255;
    this.motorPower = ((data[34] & 255) << 8) + (data[33] & 255);
    this.batteryResistanceEstimated =
      (((data[36] & 255) << 8) + (data[35] & 255)) / 1000;

    return true;
  }

  formatData(): number[] {
    this.data[0] = this.assistLevelTarget;
    this.data[1] = this.motorStateTarget;
    return this.data;
  }
}
