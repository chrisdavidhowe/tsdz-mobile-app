import ByteBuffer from 'bytebuffer';

/* eslint-disable no-bitwise */
const ASSIST_LEVEL_NUMBER: number = 7;
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

function X10toNum(input: number): number {
  let number = Number(input) / 10;
  return number;
}

function Div1000toNum(input: number): number {
  let number = Number(input) / 1000;
  return number;
}

function toByte(value: number): number {
  return value & 0xff; // Apply a bitwise AND operation with 0xFF (255 in decimal)
}

export class TSDZ_Configurations {
  buffer = new ByteBuffer(CONFIGURATIONS_ADV_SIZE);
  TAG: string = 'TSDZ_Configurations';

  assist_level: number = 0;
  wheel_max_speed: number = 0;
  wheel_perimeter: number = 0;
  units_type: number = 0;
  ui32_wh_x10: number = 0;
  wh: number = 0.0;
  ui32_wh_x10_100_percent: number = 0;
  wh_100_percent: number = 0;
  battery_soc_enable: number = 0;
  target_max_battery_power_div25: number = 0;
  battery_max_current: number = 0;
  motor_max_current: number = 0;
  motor_current_min_adc: number = 0;
  field_weakening: number = 0;
  ramp_up_amps_per_second_x10: number = 0;
  ramp_up_amps_per_second: number = 0.0;
  battery_low_voltage_cut_ofx10: number = 0;
  battery_low_voltage_cut_off: number = 0.0;
  motor_type: number = 0;
  motor_current_control_mode: number = 0;
  motor_assistance_startup_without_pedal_rotation: number = 0;
  assist_level_factor: number[] = new Array(ASSIST_LEVEL_NUMBER);
  assist_level_factor_div100: number[] = new Array(ASSIST_LEVEL_NUMBER);
  number_oassist_levels: number = 0;
  startup_motor_power_boost_feature_enabled: number = 0;
  startup_motor_power_boost_always: number = 0;
  startup_motor_power_boost_limit_power: number = 0;
  startup_motor_power_boost_factor: number[] = new Array(ASSIST_LEVEL_NUMBER);
  startup_motor_power_boost_factor_div100: number[] = new Array(
    ASSIST_LEVEL_NUMBER,
  );
  startup_motor_power_boost_time: number = 0;
  startup_motor_power_boost_fade_time: number = 0;
  temperature_limit_feature_enabled: number = 0;
  motor_temperature_min_value_to_limit: number = 0;
  motor_temperature_max_value_to_limit: number = 0;
  battery_voltage_reset_wh_counter_x10: number = 0;
  battery_voltage_reset_wh_counter: number = 0.0;
  system_power_oftime_minutes: number = 0;
  battery_pack_resistance_x1000: number = 0;
  ui32_odometer_x10: number = 0;
  odometer: number = 0;
  walk_assist_feature_enabled: number = 0;
  walk_assist_level_factor: number[] = new Array(ASSIST_LEVEL_NUMBER);
  torque_sensor_calibration_feature_enabled: number = 0;
  torque_sensor_calibration_pedal_ground: number = 0;
  torque_sensor_filter: number = 0;
  torque_sensor_adc_threshold: number = 0;
  torque_sensor_calibration_table_left: number[][] = [];
  torque_sensor_calibration_table_right: number[][] = [];
  street_mode_function_enabled: number = 0;
  street_mode_enabled: number = 0;
  street_mode_enabled_on_startup: number = 0;
  street_mode_speed_limit: number = 0;
  street_mode_power_limit_div25: number = 0;
  street_mode_power_limit: number = 0;
  street_mode_throttle_enabled: number = 0;
  street_mode_hotkey_enabled: number = 0;
  pedal_cadence_fast_stop: number = 0;
  throttle_virtual_step: number = 0;
  coast_brake_enable: number = 0;
  coast_brake_adc: number = 0;
  ant_device_id: number = 0;

  constructor() {
    const numRows = 8;
    const numCols = 2;
    for (let i = 0; i < numRows; i++) {
      this.torque_sensor_calibration_table_left[i] = new Array(numCols).fill(0);
      this.torque_sensor_calibration_table_right[i] = new Array(numCols).fill(
        0,
      );
    }
  }

  getData(data: ByteBuffer): boolean {
    if (data.buffer.length !== CONFIGURATIONS_ADV_SIZE) {
      console.error(this.TAG, 'setData: wrong data size');
      return false;
    }

    if (data.buffer[0] === CONFIGURATIONS_VERSION) {
      this.assist_level = data.buffer[1];
      this.wheel_perimeter =
        ((data.buffer[3] & 255) << 8) + (data.buffer[2] & 255);
      this.wheel_max_speed = data.buffer[4];
      this.units_type = data.buffer[5];
      this.ui32_wh_x10 =
        (data.buffer[6] & 255) +
        ((data.buffer[7] & 255) << 8) +
        ((data.buffer[8] & 255) << 16) +
        ((data.buffer[9] & 255) << 24);
      this.wh = X10toNum(this.ui32_wh_x10);
      this.ui32_wh_x10_100_percent =
        (data.buffer[10] & 255) +
        ((data.buffer[11] & 255) << 8) +
        ((data.buffer[12] & 255) << 16) +
        ((data.buffer[13] & 255) << 24);
      this.wh_100_percent = X10toNum(this.ui32_wh_x10_100_percent);
      this.battery_soc_enable = data.buffer[14];
      this.target_max_battery_power_div25 = data.buffer[15];
      this.battery_max_current = data.buffer[16];
      this.motor_max_current = data.buffer[17];
      this.motor_current_min_adc = data.buffer[18];
      this.field_weakening = data.buffer[19];
      this.ramp_up_amps_per_second_x10 = data.buffer[20];
      this.ramp_up_amps_per_second = X10toNum(
        this.ramp_up_amps_per_second_x10 & 255,
      );
      this.battery_low_voltage_cut_ofx10 =
        ((data.buffer[22] & 255) << 8) + (data.buffer[21] & 255);
      this.battery_low_voltage_cut_off = X10toNum(
        this.battery_low_voltage_cut_ofx10,
      );
      this.motor_type = data.buffer[23];
      this.motor_current_control_mode = data.buffer[24];
      this.motor_assistance_startup_without_pedal_rotation = data.buffer[25];
      this.assist_level_factor[0] =
        ((data.buffer[27] & 255) << 8) + (data.buffer[26] & 255);
      this.assist_level_factor_div100[0] = Div1000toNum(
        this.assist_level_factor[0],
      );
      this.assist_level_factor[1] =
        ((data.buffer[29] & 255) << 8) + (data.buffer[28] & 255);
      this.assist_level_factor_div100[1] = Div1000toNum(
        this.assist_level_factor[1],
      );
      this.assist_level_factor[2] =
        ((data.buffer[31] & 255) << 8) + (data.buffer[30] & 255);
      this.assist_level_factor_div100[2] = Div1000toNum(
        this.assist_level_factor[2],
      );
      this.assist_level_factor[3] =
        ((data.buffer[33] & 255) << 8) + (data.buffer[32] & 255);
      this.assist_level_factor_div100[3] = Div1000toNum(
        this.assist_level_factor[3],
      );
      this.assist_level_factor[4] =
        ((data.buffer[33] & 255) << 8) + (data.buffer[34] & 255);
      this.assist_level_factor_div100[4] = Div1000toNum(
        this.assist_level_factor[4],
      );
      this.assist_level_factor[5] =
        ((data.buffer[37] & 255) << 8) + (data.buffer[36] & 255);
      this.assist_level_factor_div100[5] = Div1000toNum(
        this.assist_level_factor[5],
      );
      this.assist_level_factor[6] =
        ((data.buffer[39] & 255) << 8) + (data.buffer[38] & 255);
      this.assist_level_factor_div100[6] = Div1000toNum(
        this.assist_level_factor[6],
      );
      this.number_oassist_levels = data.buffer[40];
      this.startup_motor_power_boost_feature_enabled = data.buffer[41];
      this.startup_motor_power_boost_always = data.buffer[42];
      this.startup_motor_power_boost_limit_power = data.buffer[43];
      this.startup_motor_power_boost_factor[0] =
        ((data.buffer[45] & 255) << 8) + (data.buffer[44] & 255);
      this.startup_motor_power_boost_factor_div100[0] = Div1000toNum(
        this.startup_motor_power_boost_factor[0],
      );
      this.startup_motor_power_boost_factor[1] =
        ((data.buffer[47] & 255) << 8) + (data.buffer[46] & 255);
      this.startup_motor_power_boost_factor_div100[1] = Div1000toNum(
        this.startup_motor_power_boost_factor[1],
      );
      this.startup_motor_power_boost_factor[2] =
        ((data.buffer[49] & 255) << 8) + (data.buffer[48] & 255);
      this.startup_motor_power_boost_factor_div100[2] = Div1000toNum(
        this.startup_motor_power_boost_factor[2],
      );
      this.startup_motor_power_boost_factor[3] =
        ((data.buffer[51] & 255) << 8) + (data.buffer[50] & 255);
      this.startup_motor_power_boost_factor_div100[3] = Div1000toNum(
        this.startup_motor_power_boost_factor[3],
      );
      this.startup_motor_power_boost_factor[4] =
        ((data.buffer[53] & 255) << 8) + (data.buffer[52] & 255);
      this.startup_motor_power_boost_factor_div100[4] = Div1000toNum(
        this.startup_motor_power_boost_factor[4],
      );
      this.startup_motor_power_boost_factor[5] =
        ((data.buffer[55] & 255) << 8) + (data.buffer[54] & 255);
      this.startup_motor_power_boost_factor_div100[5] = Div1000toNum(
        this.startup_motor_power_boost_factor[5],
      );
      this.startup_motor_power_boost_factor[6] =
        ((data.buffer[160] & 255) << 8) + (data.buffer[159] & 255);
      this.startup_motor_power_boost_factor_div100[6] = Div1000toNum(
        this.startup_motor_power_boost_factor[6],
      );
      this.startup_motor_power_boost_time = data.buffer[56];
      this.startup_motor_power_boost_time = X10toNum(
        this.startup_motor_power_boost_time & 0xff,
      );
      this.startup_motor_power_boost_fade_time = data.buffer[57];
      this.startup_motor_power_boost_fade_time = X10toNum(
        this.startup_motor_power_boost_fade_time & 0xff,
      );
      this.temperature_limit_feature_enabled = data.buffer[58];
      this.motor_temperature_min_value_to_limit = data.buffer[59];
      this.motor_temperature_max_value_to_limit = data.buffer[60];
      this.coast_brake_enable = data.buffer[61];
      this.coast_brake_adc = data.buffer[62];
      this.battery_voltage_reset_wh_counter_x10 =
        ((data.buffer[64] & 255) << 8) + (data.buffer[63] & 255);
      this.battery_voltage_reset_wh_counter = X10toNum(
        this.battery_voltage_reset_wh_counter_x10,
      );
      this.system_power_oftime_minutes = data.buffer[65];
      this.battery_pack_resistance_x1000 =
        ((data.buffer[67] & 255) << 8) + (data.buffer[66] & 255);
      this.ui32_odometer_x10 =
        ((data.buffer[71] & 255) << 24) +
        ((data.buffer[70] & 255) << 16) +
        ((data.buffer[69] & 255) << 8) +
        (data.buffer[68] & 255);
      this.odometer = X10toNum(this.ui32_odometer_x10);
      this.walk_assist_feature_enabled = data.buffer[72];
      this.walk_assist_level_factor[0] = data.buffer[73];
      this.walk_assist_level_factor[1] = data.buffer[74];
      this.walk_assist_level_factor[2] = data.buffer[75];
      this.walk_assist_level_factor[3] = data.buffer[76];
      this.walk_assist_level_factor[4] = data.buffer[77];
      this.walk_assist_level_factor[5] = data.buffer[78];
      this.walk_assist_level_factor[6] = data.buffer[79];
      this.torque_sensor_calibration_feature_enabled = data.buffer[80];
      this.torque_sensor_calibration_pedal_ground = data.buffer[81];
      this.torque_sensor_filter = data.buffer[82];
      this.torque_sensor_adc_threshold = data.buffer[83];
      this.torque_sensor_calibration_table_left[0][0] =
        ((data.buffer[85] & 255) << 8) + (data.buffer[84] & 255);
      this.torque_sensor_calibration_table_left[0][1] =
        ((data.buffer[87] & 255) << 8) + (data.buffer[86] & 255);
      this.torque_sensor_calibration_table_left[1][0] =
        ((data.buffer[89] & 255) << 8) + (data.buffer[88] & 255);
      this.torque_sensor_calibration_table_left[1][1] =
        ((data.buffer[91] & 255) << 8) + (data.buffer[90] & 255);
      this.torque_sensor_calibration_table_left[2][0] =
        ((data.buffer[93] & 255) << 8) + (data.buffer[92] & 255);
      this.torque_sensor_calibration_table_left[2][1] =
        ((data.buffer[95] & 255) << 8) + (data.buffer[94] & 255);
      this.torque_sensor_calibration_table_left[3][0] =
        ((data.buffer[97] & 255) << 8) + (data.buffer[96] & 255);
      this.torque_sensor_calibration_table_left[3][1] =
        ((data.buffer[99] & 255) << 8) + (data.buffer[98] & 255);
      this.torque_sensor_calibration_table_left[4][0] =
        ((data.buffer[101] & 255) << 8) + (data.buffer[100] & 255);
      this.torque_sensor_calibration_table_left[4][1] =
        ((data.buffer[103] & 255) << 8) + (data.buffer[102] & 255);
      this.torque_sensor_calibration_table_left[5][0] =
        ((data.buffer[105] & 255) << 8) + (data.buffer[104] & 255);
      this.torque_sensor_calibration_table_left[5][1] =
        ((data.buffer[107] & 255) << 8) + (data.buffer[106] & 255);
      this.torque_sensor_calibration_table_left[6][0] =
        ((data.buffer[109] & 255) << 8) + (data.buffer[108] & 255);
      this.torque_sensor_calibration_table_left[6][1] =
        ((data.buffer[111] & 255) << 8) + (data.buffer[110] & 255);
      this.torque_sensor_calibration_table_left[7][0] =
        ((data.buffer[113] & 255) << 8) + (data.buffer[112] & 255);
      this.torque_sensor_calibration_table_left[7][1] =
        ((data.buffer[115] & 255) << 8) + (data.buffer[114] & 255);
      this.torque_sensor_calibration_table_right[0][0] =
        ((data.buffer[117] & 255) << 8) + (data.buffer[116] & 255);
      this.torque_sensor_calibration_table_right[0][1] =
        ((data.buffer[119] & 255) << 8) + (data.buffer[118] & 255);
      this.torque_sensor_calibration_table_right[1][0] =
        ((data.buffer[121] & 255) << 8) + (data.buffer[120] & 255);
      this.torque_sensor_calibration_table_right[1][1] =
        ((data.buffer[123] & 255) << 8) + (data.buffer[122] & 255);
      this.torque_sensor_calibration_table_right[2][0] =
        ((data.buffer[125] & 255) << 8) + (data.buffer[124] & 255);
      this.torque_sensor_calibration_table_right[2][1] =
        ((data.buffer[127] & 255) << 8) + (data.buffer[126] & 255);
      this.torque_sensor_calibration_table_right[3][0] =
        ((data.buffer[129] & 255) << 8) + (data.buffer[128] & 255);
      this.torque_sensor_calibration_table_right[3][1] =
        ((data.buffer[131] & 255) << 8) + (data.buffer[130] & 255);
      this.torque_sensor_calibration_table_right[4][0] =
        ((data.buffer[133] & 255) << 8) + (data.buffer[132] & 255);
      this.torque_sensor_calibration_table_right[4][1] =
        ((data.buffer[135] & 255) << 8) + (data.buffer[134] & 255);
      this.torque_sensor_calibration_table_right[5][0] =
        ((data.buffer[137] & 255) << 8) + (data.buffer[136] & 255);
      this.torque_sensor_calibration_table_right[5][1] =
        ((data.buffer[139] & 255) << 8) + (data.buffer[138] & 255);
      this.torque_sensor_calibration_table_right[6][0] =
        ((data.buffer[141] & 255) << 8) + (data.buffer[140] & 255);
      this.torque_sensor_calibration_table_right[6][1] =
        ((data.buffer[143] & 255) << 8) + (data.buffer[142] & 255);
      this.torque_sensor_calibration_table_right[7][0] =
        ((data.buffer[145] & 255) << 8) + (data.buffer[144] & 255);
      this.torque_sensor_calibration_table_right[7][1] =
        ((data.buffer[147] & 255) << 8) + (data.buffer[146] & 255);
      this.street_mode_function_enabled = data.buffer[148];
      this.street_mode_enabled = data.buffer[149];
      this.street_mode_enabled_on_startup = data.buffer[150];
      this.street_mode_speed_limit = data.buffer[151];
      this.street_mode_power_limit_div25 = data.buffer[152];
      this.street_mode_power_limit = this.street_mode_power_limit_div25 * 25;
      this.street_mode_throttle_enabled = data.buffer[153];
      this.street_mode_hotkey_enabled = data.buffer[154];
      this.pedal_cadence_fast_stop = data.buffer[155];
      this.throttle_virtual_step = data.buffer[156];
      this.street_mode_enabled = data.buffer[157];
      this.ant_device_id = data.buffer[158];

      return true;
    }

    console.error(this.TAG, 'setData: wrong configurations version');
    return false;
  }

  formatData(): ByteBuffer {
    let data: ByteBuffer = new ByteBuffer(CONFIGURATIONS_ADV_SIZE);
    data.buffer[0] = toByte(CONFIGURATIONS_VERSION); // configurations version
    data.buffer[1] = toByte(this.assist_level);
    data.buffer[2] = toByte(this.wheel_perimeter & 0xff);
    data.buffer[3] = toByte(this.wheel_perimeter >>> 8);
    data.buffer[4] = toByte(this.wheel_max_speed);
    data.buffer[5] = toByte(this.units_type);
    data.buffer[6] = toByte(this.ui32_wh_x10 & 0xff);
    data.buffer[7] = toByte(this.ui32_wh_x10 >>> 8);
    data.buffer[8] = toByte(this.ui32_wh_x10 >>> 16);
    data.buffer[9] = toByte(this.ui32_wh_x10 >>> 24);
    data.buffer[10] = toByte(this.ui32_wh_x10_100_percent & 0xff);
    data.buffer[11] = toByte(this.ui32_wh_x10_100_percent >>> 8);
    data.buffer[12] = toByte(this.ui32_wh_x10_100_percent >>> 16);
    data.buffer[13] = toByte(this.ui32_wh_x10_100_percent >>> 24);
    data.buffer[14] = toByte(this.battery_soc_enable);
    data.buffer[15] = toByte(this.target_max_battery_power_div25);
    data.buffer[16] = toByte(this.battery_max_current);
    data.buffer[17] = toByte(this.motor_max_current);
    data.buffer[18] = toByte(this.motor_current_min_adc);
    data.buffer[19] = toByte(this.field_weakening);
    data.buffer[20] = toByte(this.ramp_up_amps_per_second_x10);
    data.buffer[21] = toByte(this.battery_low_voltage_cut_ofx10 & 0xff);
    data.buffer[22] = toByte(this.battery_low_voltage_cut_ofx10 >>> 8);
    data.buffer[23] = toByte(this.motor_type);
    data.buffer[24] = toByte(this.motor_current_control_mode);
    data.buffer[25] = toByte(
      this.motor_assistance_startup_without_pedal_rotation,
    );
    data.buffer[26] = toByte(this.assist_level_factor[0] & 0xff);
    data.buffer[27] = toByte(this.assist_level_factor[0] >> 8);
    data.buffer[28] = toByte(this.assist_level_factor[1] & 0xff);
    data.buffer[29] = toByte(this.assist_level_factor[1] >> 8);
    data.buffer[30] = toByte(this.assist_level_factor[2] & 0xff);
    data.buffer[31] = toByte(this.assist_level_factor[2] >> 8);
    data.buffer[32] = toByte(this.assist_level_factor[3] & 0xff);
    data.buffer[33] = toByte(this.assist_level_factor[3] >> 8);
    data.buffer[34] = toByte(this.assist_level_factor[4] & 0xff);
    data.buffer[35] = toByte(this.assist_level_factor[4] >> 8);
    data.buffer[36] = toByte(this.assist_level_factor[5] & 0xff);
    data.buffer[37] = toByte(this.assist_level_factor[5] >> 8);
    data.buffer[38] = toByte(this.assist_level_factor[6] & 0xff);
    data.buffer[39] = toByte(this.assist_level_factor[6] >> 8);
    data.buffer[40] = toByte(this.number_oassist_levels);
    data.buffer[41] = toByte(this.startup_motor_power_boost_feature_enabled);
    data.buffer[42] = toByte(this.startup_motor_power_boost_always);
    data.buffer[43] = toByte(this.startup_motor_power_boost_limit_power);
    data.buffer[44] = toByte(this.startup_motor_power_boost_factor[0] & 0xff);
    data.buffer[45] = toByte(this.startup_motor_power_boost_factor[0] >> 8);
    data.buffer[46] = toByte(this.startup_motor_power_boost_factor[1] & 0xff);
    data.buffer[47] = toByte(this.startup_motor_power_boost_factor[1] >> 8);
    data.buffer[48] = toByte(this.startup_motor_power_boost_factor[2] & 0xff);
    data.buffer[49] = toByte(this.startup_motor_power_boost_factor[2] >> 8);
    data.buffer[50] = toByte(this.startup_motor_power_boost_factor[3] & 0xff);
    data.buffer[51] = toByte(this.startup_motor_power_boost_factor[3] >> 8);
    data.buffer[52] = toByte(this.startup_motor_power_boost_factor[4] & 0xff);
    data.buffer[53] = toByte(this.startup_motor_power_boost_factor[4] >> 8);
    data.buffer[54] = toByte(this.startup_motor_power_boost_factor[5] & 0xff);
    data.buffer[55] = toByte(this.startup_motor_power_boost_factor[5] >> 8);
    data.buffer[159] = toByte(this.startup_motor_power_boost_factor[6] & 0xff);
    data.buffer[160] = toByte(this.startup_motor_power_boost_factor[6] >> 8);
    data.buffer[56] = toByte(this.startup_motor_power_boost_time);
    data.buffer[57] = toByte(this.startup_motor_power_boost_fade_time);
    data.buffer[58] = toByte(this.temperature_limit_feature_enabled);
    data.buffer[59] = toByte(this.motor_temperature_min_value_to_limit);
    data.buffer[60] = toByte(this.motor_temperature_max_value_to_limit);
    data.buffer[61] = toByte(this.coast_brake_enable);
    data.buffer[62] = toByte(this.coast_brake_adc);
    data.buffer[63] = toByte(this.battery_voltage_reset_wh_counter_x10 & 0xff);
    data.buffer[64] = toByte(this.battery_voltage_reset_wh_counter_x10 >> 8);
    data.buffer[65] = toByte(this.system_power_oftime_minutes);
    data.buffer[66] = toByte(this.battery_pack_resistance_x1000 & 0xff);
    data.buffer[67] = toByte(this.battery_pack_resistance_x1000 >> 8);
    data.buffer[68] = toByte(this.ui32_odometer_x10 & 0xff);
    data.buffer[69] = toByte((this.ui32_odometer_x10 >> 8) & 0xff);
    data.buffer[70] = toByte((this.ui32_odometer_x10 >> 16) & 0xff);
    data.buffer[71] = toByte((this.ui32_odometer_x10 >> 24) & 0xff);
    data.buffer[72] = toByte(this.walk_assist_feature_enabled);
    data.buffer[73] = toByte(this.walk_assist_level_factor[0]);
    data.buffer[74] = toByte(this.walk_assist_level_factor[1]);
    data.buffer[75] = toByte(this.walk_assist_level_factor[2]);
    data.buffer[76] = toByte(this.walk_assist_level_factor[3]);
    data.buffer[77] = toByte(this.walk_assist_level_factor[4]);
    data.buffer[78] = toByte(this.walk_assist_level_factor[5]);
    data.buffer[79] = toByte(this.walk_assist_level_factor[6]);
    data.buffer[80] = toByte(this.torque_sensor_calibration_feature_enabled);
    data.buffer[81] = toByte(this.torque_sensor_calibration_pedal_ground);
    data.buffer[82] = toByte(this.torque_sensor_filter);
    data.buffer[83] = toByte(this.torque_sensor_adc_threshold);
    data.buffer[84] = toByte(
      this.torque_sensor_calibration_table_left[0][0] & 0xff,
    );
    data.buffer[85] = toByte(
      this.torque_sensor_calibration_table_left[0][0] >> 8,
    );
    data.buffer[86] = toByte(
      this.torque_sensor_calibration_table_left[0][1] & 0xff,
    );
    data.buffer[87] = toByte(
      this.torque_sensor_calibration_table_left[0][1] >> 8,
    );
    data.buffer[88] = toByte(
      this.torque_sensor_calibration_table_left[1][0] & 0xff,
    );
    data.buffer[89] = toByte(
      this.torque_sensor_calibration_table_left[1][0] >> 8,
    );
    data.buffer[90] = toByte(
      this.torque_sensor_calibration_table_left[1][1] & 0xff,
    );
    data.buffer[91] = toByte(
      this.torque_sensor_calibration_table_left[1][1] >> 8,
    );
    data.buffer[92] = toByte(
      this.torque_sensor_calibration_table_left[2][0] & 0xff,
    );
    data.buffer[93] = toByte(
      this.torque_sensor_calibration_table_left[2][0] >> 8,
    );
    data.buffer[94] = toByte(
      this.torque_sensor_calibration_table_left[2][1] & 0xff,
    );
    data.buffer[95] = toByte(
      this.torque_sensor_calibration_table_left[2][1] >> 8,
    );
    data.buffer[96] = toByte(
      this.torque_sensor_calibration_table_left[3][0] & 0xff,
    );
    data.buffer[97] = toByte(
      this.torque_sensor_calibration_table_left[3][0] >> 8,
    );
    data.buffer[98] = toByte(
      this.torque_sensor_calibration_table_left[3][1] & 0xff,
    );
    data.buffer[99] = toByte(
      this.torque_sensor_calibration_table_left[3][1] >> 8,
    );
    data.buffer[100] = toByte(
      this.torque_sensor_calibration_table_left[4][0] & 0xff,
    );
    data.buffer[101] = toByte(
      this.torque_sensor_calibration_table_left[4][0] >> 8,
    );
    data.buffer[102] = toByte(
      this.torque_sensor_calibration_table_left[4][1] & 0xff,
    );
    data.buffer[103] = toByte(
      this.torque_sensor_calibration_table_left[4][1] >> 8,
    );
    data.buffer[104] = toByte(
      this.torque_sensor_calibration_table_left[5][0] & 0xff,
    );
    data.buffer[105] = toByte(
      this.torque_sensor_calibration_table_left[5][0] >> 8,
    );
    data.buffer[106] = toByte(
      this.torque_sensor_calibration_table_left[5][1] & 0xff,
    );
    data.buffer[107] = toByte(
      this.torque_sensor_calibration_table_left[5][1] >> 8,
    );
    data.buffer[108] = toByte(
      this.torque_sensor_calibration_table_left[6][0] & 0xff,
    );
    data.buffer[109] = toByte(
      this.torque_sensor_calibration_table_left[6][0] >> 8,
    );
    data.buffer[110] = toByte(
      this.torque_sensor_calibration_table_left[6][1] & 0xff,
    );
    data.buffer[111] = toByte(
      this.torque_sensor_calibration_table_left[6][1] >> 8,
    );
    data.buffer[112] = toByte(
      this.torque_sensor_calibration_table_left[7][0] & 0xff,
    );
    data.buffer[113] = toByte(
      this.torque_sensor_calibration_table_left[7][0] >> 8,
    );
    data.buffer[114] = toByte(
      this.torque_sensor_calibration_table_left[7][1] & 0xff,
    );
    data.buffer[115] = toByte(
      this.torque_sensor_calibration_table_left[7][1] >> 8,
    );
    data.buffer[116] = toByte(
      this.torque_sensor_calibration_table_right[0][0] & 0xff,
    );
    data.buffer[117] = toByte(
      this.torque_sensor_calibration_table_right[0][0] >> 8,
    );
    data.buffer[118] = toByte(
      this.torque_sensor_calibration_table_right[0][1] & 0xff,
    );
    data.buffer[119] = toByte(
      this.torque_sensor_calibration_table_right[0][1] >> 8,
    );
    data.buffer[120] = toByte(
      this.torque_sensor_calibration_table_right[1][0] & 0xff,
    );
    data.buffer[121] = toByte(
      this.torque_sensor_calibration_table_right[1][0] >> 8,
    );
    data.buffer[122] = toByte(
      this.torque_sensor_calibration_table_right[1][1] & 0xff,
    );
    data.buffer[123] = toByte(
      this.torque_sensor_calibration_table_right[1][1] >> 8,
    );
    data.buffer[124] = toByte(
      this.torque_sensor_calibration_table_right[2][0] & 0xff,
    );
    data.buffer[125] = toByte(
      this.torque_sensor_calibration_table_right[2][0] >> 8,
    );
    data.buffer[126] = toByte(
      this.torque_sensor_calibration_table_right[2][1] & 0xff,
    );
    data.buffer[127] = toByte(
      this.torque_sensor_calibration_table_right[2][1] >> 8,
    );
    data.buffer[128] = toByte(
      this.torque_sensor_calibration_table_right[3][0] & 0xff,
    );
    data.buffer[129] = toByte(
      this.torque_sensor_calibration_table_right[3][0] >> 8,
    );
    data.buffer[130] = toByte(
      this.torque_sensor_calibration_table_right[3][1] & 0xff,
    );
    data.buffer[131] = toByte(
      this.torque_sensor_calibration_table_right[3][1] >> 8,
    );
    data.buffer[132] = toByte(
      this.torque_sensor_calibration_table_right[4][0] & 0xff,
    );
    data.buffer[133] = toByte(
      this.torque_sensor_calibration_table_right[4][0] >> 8,
    );
    data.buffer[134] = toByte(
      this.torque_sensor_calibration_table_right[4][1] & 0xff,
    );
    data.buffer[135] = toByte(
      this.torque_sensor_calibration_table_right[4][1] >> 8,
    );
    data.buffer[136] = toByte(
      this.torque_sensor_calibration_table_right[5][0] & 0xff,
    );
    data.buffer[137] = toByte(
      this.torque_sensor_calibration_table_right[5][0] >> 8,
    );
    data.buffer[138] = toByte(
      this.torque_sensor_calibration_table_right[5][1] & 0xff,
    );
    data.buffer[139] = toByte(
      this.torque_sensor_calibration_table_right[5][1] >> 8,
    );
    data.buffer[140] = toByte(
      this.torque_sensor_calibration_table_right[6][0] & 0xff,
    );
    data.buffer[141] = toByte(
      this.torque_sensor_calibration_table_right[6][0] >> 8,
    );
    data.buffer[142] = toByte(
      this.torque_sensor_calibration_table_right[6][1] & 0xff,
    );
    data.buffer[143] = toByte(
      this.torque_sensor_calibration_table_right[6][1] >> 8,
    );
    data.buffer[144] = toByte(
      this.torque_sensor_calibration_table_right[7][0] & 0xff,
    );
    data.buffer[145] = toByte(
      this.torque_sensor_calibration_table_right[7][0] >> 8,
    );
    data.buffer[146] = toByte(
      this.torque_sensor_calibration_table_right[7][1] & 0xff,
    );
    data.buffer[147] = toByte(
      this.torque_sensor_calibration_table_right[7][1] >> 8,
    );
    data.buffer[148] = toByte(this.street_mode_function_enabled);
    data.buffer[149] = toByte(this.street_mode_enabled);
    data.buffer[150] = toByte(this.street_mode_enabled_on_startup);
    data.buffer[151] = toByte(this.street_mode_speed_limit);
    data.buffer[152] = toByte(this.street_mode_power_limit_div25);
    data.buffer[153] = toByte(this.street_mode_throttle_enabled);
    data.buffer[154] = toByte(this.street_mode_hotkey_enabled);
    data.buffer[155] = toByte(this.pedal_cadence_fast_stop);
    data.buffer[156] = toByte(this.throttle_virtual_step);
    data.buffer[157] = toByte(this.street_mode_enabled);
    data.buffer[158] = toByte(this.ant_device_id);

    return data;
  }
}
