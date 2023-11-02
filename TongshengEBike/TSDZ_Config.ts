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

export class TSDZ_Configurations {
  data = new Array<number>(CONFIGURATIONS_ADV_SIZE);
  TAG: string = 'TSDZ_Configurations';

  assist_level: number = 0;
  assist_level_prct: number = 0;
  wheel_max_speed: number = 50;
  wheel_perimeter: number = 750;
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
  assist_level_factor: number[] = new Array(ASSIST_LEVEL_NUMBER).fill(0);
  assist_level_factor_div100: number[] = new Array(ASSIST_LEVEL_NUMBER).fill(0);
  number_oassist_levels: number = 0;
  startup_motor_power_boost_feature_enabled: number = 0;
  startup_motor_power_boost_always: number = 0;
  startup_motor_power_boost_limit_power: number = 0;
  startup_motor_power_boost_factor: number[] = new Array(
    ASSIST_LEVEL_NUMBER,
  ).fill(0);
  startup_motor_power_boost_factor_div100: number[] = new Array(
    ASSIST_LEVEL_NUMBER,
  ).fill(0);
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
  walk_assist_level_factor: number[] = new Array(ASSIST_LEVEL_NUMBER).fill(0);
  torque_sensor_calibration_feature_enabled: number = 0;
  torque_sensor_calibration_pedal_ground: number = 0;
  torque_sensor_filter: number = 0;
  torque_sensor_adc_threshold: number = 0;
  torque_sensor_calibration_table_left: number[][] = new Array(8).fill(
    new Array(2).fill(0),
  );
  torque_sensor_calibration_table_right: number[][] = new Array(8).fill(
    new Array(2).fill(0),
  );
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

  constructor() {}

  getData(data: number[]): boolean {
    if (data.length !== CONFIGURATIONS_ADV_SIZE) {
      console.error(this.TAG, 'setData: wrong data size');
      return false;
    }
    this.data = data;
    if (data[0] === CONFIGURATIONS_VERSION) {
      this.assist_level = data[1];
      this.wheel_perimeter = ((data[3] & 255) << 8) + (data[2] & 255);
      this.wheel_max_speed = data[4];
      this.units_type = data[5];
      this.ui32_wh_x10 =
        (data[6] & 255) +
        ((data[7] & 255) << 8) +
        ((data[8] & 255) << 16) +
        ((data[9] & 255) << 24);
      this.wh = X10toNum(this.ui32_wh_x10);
      this.ui32_wh_x10_100_percent =
        (data[10] & 255) +
        ((data[11] & 255) << 8) +
        ((data[12] & 255) << 16) +
        ((data[13] & 255) << 24);
      this.wh_100_percent = X10toNum(this.ui32_wh_x10_100_percent);
      this.battery_soc_enable = data[14];
      this.target_max_battery_power_div25 = data[15];
      this.battery_max_current = data[16];
      this.motor_max_current = data[17];
      this.motor_current_min_adc = data[18];
      this.field_weakening = data[19];
      this.ramp_up_amps_per_second_x10 = data[20];
      this.ramp_up_amps_per_second = X10toNum(
        this.ramp_up_amps_per_second_x10 & 255,
      );
      this.battery_low_voltage_cut_ofx10 =
        ((data[22] & 255) << 8) + (data[21] & 255);
      this.battery_low_voltage_cut_off = X10toNum(
        this.battery_low_voltage_cut_ofx10,
      );
      this.motor_type = data[23];
      this.motor_current_control_mode = data[24];
      this.motor_assistance_startup_without_pedal_rotation = data[25];
      this.assist_level_factor[0] = ((data[27] & 255) << 8) + (data[26] & 255);
      this.assist_level_factor_div100[0] = Div1000toNum(
        this.assist_level_factor[0],
      );
      this.assist_level_factor[1] = ((data[29] & 255) << 8) + (data[28] & 255);
      this.assist_level_factor_div100[1] = Div1000toNum(
        this.assist_level_factor[1],
      );
      this.assist_level_factor[2] = ((data[31] & 255) << 8) + (data[30] & 255);
      this.assist_level_factor_div100[2] = Div1000toNum(
        this.assist_level_factor[2],
      );
      this.assist_level_factor[3] = ((data[33] & 255) << 8) + (data[32] & 255);
      this.assist_level_factor_div100[3] = Div1000toNum(
        this.assist_level_factor[3],
      );
      this.assist_level_factor[4] = ((data[33] & 255) << 8) + (data[34] & 255);
      this.assist_level_factor_div100[4] = Div1000toNum(
        this.assist_level_factor[4],
      );
      this.assist_level_factor[5] = ((data[37] & 255) << 8) + (data[36] & 255);
      this.assist_level_factor_div100[5] = Div1000toNum(
        this.assist_level_factor[5],
      );
      this.assist_level_factor[6] = ((data[39] & 255) << 8) + (data[38] & 255);
      this.assist_level_factor_div100[6] = Div1000toNum(
        this.assist_level_factor[6],
      );
      this.assist_level_prct = this.assist_level_factor[this.assist_level];
      this.number_oassist_levels = data[40];
      this.startup_motor_power_boost_feature_enabled = data[41];
      this.startup_motor_power_boost_always = data[42];
      this.startup_motor_power_boost_limit_power = data[43];
      this.startup_motor_power_boost_factor[0] =
        ((data[45] & 255) << 8) + (data[44] & 255);
      this.startup_motor_power_boost_factor_div100[0] = Div1000toNum(
        this.startup_motor_power_boost_factor[0],
      );
      this.startup_motor_power_boost_factor[1] =
        ((data[47] & 255) << 8) + (data[46] & 255);
      this.startup_motor_power_boost_factor_div100[1] = Div1000toNum(
        this.startup_motor_power_boost_factor[1],
      );
      this.startup_motor_power_boost_factor[2] =
        ((data[49] & 255) << 8) + (data[48] & 255);
      this.startup_motor_power_boost_factor_div100[2] = Div1000toNum(
        this.startup_motor_power_boost_factor[2],
      );
      this.startup_motor_power_boost_factor[3] =
        ((data[51] & 255) << 8) + (data[50] & 255);
      this.startup_motor_power_boost_factor_div100[3] = Div1000toNum(
        this.startup_motor_power_boost_factor[3],
      );
      this.startup_motor_power_boost_factor[4] =
        ((data[53] & 255) << 8) + (data[52] & 255);
      this.startup_motor_power_boost_factor_div100[4] = Div1000toNum(
        this.startup_motor_power_boost_factor[4],
      );
      this.startup_motor_power_boost_factor[5] =
        ((data[55] & 255) << 8) + (data[54] & 255);
      this.startup_motor_power_boost_factor_div100[5] = Div1000toNum(
        this.startup_motor_power_boost_factor[5],
      );
      this.startup_motor_power_boost_factor[6] =
        ((data[160] & 255) << 8) + (data[159] & 255);
      this.startup_motor_power_boost_factor_div100[6] = Div1000toNum(
        this.startup_motor_power_boost_factor[6],
      );
      this.startup_motor_power_boost_time = data[56];
      this.startup_motor_power_boost_time = X10toNum(
        this.startup_motor_power_boost_time & 0xff,
      );
      this.startup_motor_power_boost_fade_time = data[57];
      this.startup_motor_power_boost_fade_time = X10toNum(
        this.startup_motor_power_boost_fade_time & 0xff,
      );
      this.temperature_limit_feature_enabled = data[58];
      this.motor_temperature_min_value_to_limit = data[59];
      this.motor_temperature_max_value_to_limit = data[60];
      this.coast_brake_enable = data[61];
      this.coast_brake_adc = data[62];
      this.battery_voltage_reset_wh_counter_x10 =
        ((data[64] & 255) << 8) + (data[63] & 255);
      this.battery_voltage_reset_wh_counter = X10toNum(
        this.battery_voltage_reset_wh_counter_x10,
      );
      this.system_power_oftime_minutes = data[65];
      this.battery_pack_resistance_x1000 =
        ((data[67] & 255) << 8) + (data[66] & 255);
      this.ui32_odometer_x10 =
        ((data[71] & 255) << 24) +
        ((data[70] & 255) << 16) +
        ((data[69] & 255) << 8) +
        (data[68] & 255);
      this.odometer = X10toNum(this.ui32_odometer_x10);
      this.walk_assist_feature_enabled = data[72];
      this.walk_assist_level_factor[0] = data[73];
      this.walk_assist_level_factor[1] = data[74];
      this.walk_assist_level_factor[2] = data[75];
      this.walk_assist_level_factor[3] = data[76];
      this.walk_assist_level_factor[4] = data[77];
      this.walk_assist_level_factor[5] = data[78];
      this.walk_assist_level_factor[6] = data[79];
      this.torque_sensor_calibration_feature_enabled = data[80];
      this.torque_sensor_calibration_pedal_ground = data[81];
      this.torque_sensor_filter = data[82];
      this.torque_sensor_adc_threshold = data[83];
      this.torque_sensor_calibration_table_left[0][0] =
        ((data[85] & 255) << 8) + (data[84] & 255);
      this.torque_sensor_calibration_table_left[0][1] =
        ((data[87] & 255) << 8) + (data[86] & 255);
      this.torque_sensor_calibration_table_left[1][0] =
        ((data[89] & 255) << 8) + (data[88] & 255);
      this.torque_sensor_calibration_table_left[1][1] =
        ((data[91] & 255) << 8) + (data[90] & 255);
      this.torque_sensor_calibration_table_left[2][0] =
        ((data[93] & 255) << 8) + (data[92] & 255);
      this.torque_sensor_calibration_table_left[2][1] =
        ((data[95] & 255) << 8) + (data[94] & 255);
      this.torque_sensor_calibration_table_left[3][0] =
        ((data[97] & 255) << 8) + (data[96] & 255);
      this.torque_sensor_calibration_table_left[3][1] =
        ((data[99] & 255) << 8) + (data[98] & 255);
      this.torque_sensor_calibration_table_left[4][0] =
        ((data[101] & 255) << 8) + (data[100] & 255);
      this.torque_sensor_calibration_table_left[4][1] =
        ((data[103] & 255) << 8) + (data[102] & 255);
      this.torque_sensor_calibration_table_left[5][0] =
        ((data[105] & 255) << 8) + (data[104] & 255);
      this.torque_sensor_calibration_table_left[5][1] =
        ((data[107] & 255) << 8) + (data[106] & 255);
      this.torque_sensor_calibration_table_left[6][0] =
        ((data[109] & 255) << 8) + (data[108] & 255);
      this.torque_sensor_calibration_table_left[6][1] =
        ((data[111] & 255) << 8) + (data[110] & 255);
      this.torque_sensor_calibration_table_left[7][0] =
        ((data[113] & 255) << 8) + (data[112] & 255);
      this.torque_sensor_calibration_table_left[7][1] =
        ((data[115] & 255) << 8) + (data[114] & 255);
      this.torque_sensor_calibration_table_right[0][0] =
        ((data[117] & 255) << 8) + (data[116] & 255);
      this.torque_sensor_calibration_table_right[0][1] =
        ((data[119] & 255) << 8) + (data[118] & 255);
      this.torque_sensor_calibration_table_right[1][0] =
        ((data[121] & 255) << 8) + (data[120] & 255);
      this.torque_sensor_calibration_table_right[1][1] =
        ((data[123] & 255) << 8) + (data[122] & 255);
      this.torque_sensor_calibration_table_right[2][0] =
        ((data[125] & 255) << 8) + (data[124] & 255);
      this.torque_sensor_calibration_table_right[2][1] =
        ((data[127] & 255) << 8) + (data[126] & 255);
      this.torque_sensor_calibration_table_right[3][0] =
        ((data[129] & 255) << 8) + (data[128] & 255);
      this.torque_sensor_calibration_table_right[3][1] =
        ((data[131] & 255) << 8) + (data[130] & 255);
      this.torque_sensor_calibration_table_right[4][0] =
        ((data[133] & 255) << 8) + (data[132] & 255);
      this.torque_sensor_calibration_table_right[4][1] =
        ((data[135] & 255) << 8) + (data[134] & 255);
      this.torque_sensor_calibration_table_right[5][0] =
        ((data[137] & 255) << 8) + (data[136] & 255);
      this.torque_sensor_calibration_table_right[5][1] =
        ((data[139] & 255) << 8) + (data[138] & 255);
      this.torque_sensor_calibration_table_right[6][0] =
        ((data[141] & 255) << 8) + (data[140] & 255);
      this.torque_sensor_calibration_table_right[6][1] =
        ((data[143] & 255) << 8) + (data[142] & 255);
      this.torque_sensor_calibration_table_right[7][0] =
        ((data[145] & 255) << 8) + (data[144] & 255);
      this.torque_sensor_calibration_table_right[7][1] =
        ((data[147] & 255) << 8) + (data[146] & 255);
      this.street_mode_function_enabled = data[148];
      this.street_mode_enabled = data[149];
      this.street_mode_enabled_on_startup = data[150];
      this.street_mode_speed_limit = data[151];
      this.street_mode_power_limit_div25 = data[152];
      this.street_mode_power_limit = this.street_mode_power_limit_div25 * 25;
      this.street_mode_throttle_enabled = data[153];
      this.street_mode_hotkey_enabled = data[154];
      this.pedal_cadence_fast_stop = data[155];
      this.throttle_virtual_step = data[156];
      this.street_mode_enabled = data[157];
      this.ant_device_id = data[158];

      return true;
    }

    console.error(this.TAG, 'setData: wrong configurations version');
    return false;
  }

  formatData(): number[] {
    let data: number[] = new Array<number>(CONFIGURATIONS_ADV_SIZE);
    data[0] = CONFIGURATIONS_VERSION;
    data[1] = this.assist_level;
    data[2] = this.wheel_perimeter & 0xff;
    data[3] = this.wheel_perimeter >>> 8;
    data[4] = this.wheel_max_speed;
    data[5] = this.units_type;
    data[6] = this.ui32_wh_x10 & 0xff;
    data[7] = this.ui32_wh_x10 >>> 8;
    data[8] = this.ui32_wh_x10 >>> 16;
    data[9] = this.ui32_wh_x10 >>> 24;
    data[10] = this.ui32_wh_x10_100_percent & 0xff;
    data[11] = this.ui32_wh_x10_100_percent >>> 8;
    data[12] = this.ui32_wh_x10_100_percent >>> 16;
    data[13] = this.ui32_wh_x10_100_percent >>> 24;
    data[14] = this.battery_soc_enable;
    data[15] = this.target_max_battery_power_div25;
    data[16] = this.battery_max_current;
    data[17] = this.motor_max_current;
    data[18] = this.motor_current_min_adc;
    data[19] = this.field_weakening;
    data[20] = this.ramp_up_amps_per_second_x10;
    data[21] = this.battery_low_voltage_cut_ofx10 & 0xff;
    data[22] = this.battery_low_voltage_cut_ofx10 >>> 8;
    data[23] = this.motor_type;
    data[24] = this.motor_current_control_mode;
    data[25] = this.motor_assistance_startup_without_pedal_rotation;
    data[26] = this.assist_level_factor[0] & 0xff;
    data[27] = this.assist_level_factor[0] >> 8;
    data[28] = this.assist_level_factor[1] & 0xff;
    data[29] = this.assist_level_factor[1] >> 8;
    data[30] = this.assist_level_factor[2] & 0xff;
    data[31] = this.assist_level_factor[2] >> 8;
    data[32] = this.assist_level_factor[3] & 0xff;
    data[33] = this.assist_level_factor[3] >> 8;
    data[34] = this.assist_level_factor[4] & 0xff;
    data[35] = this.assist_level_factor[4] >> 8;
    data[36] = this.assist_level_factor[5] & 0xff;
    data[37] = this.assist_level_factor[5] >> 8;
    data[38] = this.assist_level_factor[6] & 0xff;
    data[39] = this.assist_level_factor[6] >> 8;
    data[40] = this.number_oassist_levels;
    data[41] = this.startup_motor_power_boost_feature_enabled;
    data[42] = this.startup_motor_power_boost_always;
    data[43] = this.startup_motor_power_boost_limit_power;
    data[44] = this.startup_motor_power_boost_factor[0] & 0xff;
    data[45] = this.startup_motor_power_boost_factor[0] >> 8;
    data[46] = this.startup_motor_power_boost_factor[1] & 0xff;
    data[47] = this.startup_motor_power_boost_factor[1] >> 8;
    data[48] = this.startup_motor_power_boost_factor[2] & 0xff;
    data[49] = this.startup_motor_power_boost_factor[2] >> 8;
    data[50] = this.startup_motor_power_boost_factor[3] & 0xff;
    data[51] = this.startup_motor_power_boost_factor[3] >> 8;
    data[52] = this.startup_motor_power_boost_factor[4] & 0xff;
    data[53] = this.startup_motor_power_boost_factor[4] >> 8;
    data[54] = this.startup_motor_power_boost_factor[5] & 0xff;
    data[55] = this.startup_motor_power_boost_factor[5] >> 8;
    ///IS THIS RIGHT??
    data[159] = this.startup_motor_power_boost_factor[6] & 0xff;
    data[160] = this.startup_motor_power_boost_factor[6] >> 8;

    data[56] = this.startup_motor_power_boost_time;
    data[57] = this.startup_motor_power_boost_fade_time;
    data[58] = this.temperature_limit_feature_enabled;
    data[59] = this.motor_temperature_min_value_to_limit;
    data[60] = this.motor_temperature_max_value_to_limit;
    data[61] = this.coast_brake_enable;
    data[62] = this.coast_brake_adc;
    data[63] = this.battery_voltage_reset_wh_counter_x10 & 0xff;
    data[64] = this.battery_voltage_reset_wh_counter_x10 >> 8;
    data[65] = this.system_power_oftime_minutes;
    data[66] = this.battery_pack_resistance_x1000 & 0xff;
    data[67] = this.battery_pack_resistance_x1000 >> 8;
    data[68] = this.ui32_odometer_x10 & 0xff;
    data[69] = (this.ui32_odometer_x10 >> 8) & 0xff;
    data[70] = (this.ui32_odometer_x10 >> 16) & 0xff;
    data[71] = (this.ui32_odometer_x10 >> 24) & 0xff;
    data[72] = this.walk_assist_feature_enabled;
    data[73] = this.walk_assist_level_factor[0];
    data[74] = this.walk_assist_level_factor[1];
    data[75] = this.walk_assist_level_factor[2];
    data[76] = this.walk_assist_level_factor[3];
    data[77] = this.walk_assist_level_factor[4];
    data[78] = this.walk_assist_level_factor[5];
    data[79] = this.walk_assist_level_factor[6];
    data[80] = this.torque_sensor_calibration_feature_enabled;
    data[81] = this.torque_sensor_calibration_pedal_ground;
    data[82] = this.torque_sensor_filter;
    data[83] = this.torque_sensor_adc_threshold;
    data[84] = this.torque_sensor_calibration_table_left[0][0] & 0xff;
    data[85] = this.torque_sensor_calibration_table_left[0][0] >> 8;
    data[86] = this.torque_sensor_calibration_table_left[0][1] & 0xff;
    data[87] = this.torque_sensor_calibration_table_left[0][1] >> 8;
    data[88] = this.torque_sensor_calibration_table_left[1][0] & 0xff;
    data[89] = this.torque_sensor_calibration_table_left[1][0] >> 8;
    data[90] = this.torque_sensor_calibration_table_left[1][1] & 0xff;
    data[91] = this.torque_sensor_calibration_table_left[1][1] >> 8;
    data[92] = this.torque_sensor_calibration_table_left[2][0] & 0xff;
    data[93] = this.torque_sensor_calibration_table_left[2][0] >> 8;
    data[94] = this.torque_sensor_calibration_table_left[2][1] & 0xff;
    data[95] = this.torque_sensor_calibration_table_left[2][1] >> 8;
    data[96] = this.torque_sensor_calibration_table_left[3][0] & 0xff;
    data[97] = this.torque_sensor_calibration_table_left[3][0] >> 8;
    data[98] = this.torque_sensor_calibration_table_left[3][1] & 0xff;
    data[99] = this.torque_sensor_calibration_table_left[3][1] >> 8;
    data[100] = this.torque_sensor_calibration_table_left[4][0] & 0xff;
    data[101] = this.torque_sensor_calibration_table_left[4][0] >> 8;
    data[102] = this.torque_sensor_calibration_table_left[4][1] & 0xff;
    data[103] = this.torque_sensor_calibration_table_left[4][1] >> 8;
    data[104] = this.torque_sensor_calibration_table_left[5][0] & 0xff;
    data[105] = this.torque_sensor_calibration_table_left[5][0] >> 8;
    data[106] = this.torque_sensor_calibration_table_left[5][1] & 0xff;
    data[107] = this.torque_sensor_calibration_table_left[5][1] >> 8;
    data[108] = this.torque_sensor_calibration_table_left[6][0] & 0xff;
    data[109] = this.torque_sensor_calibration_table_left[6][0] >> 8;
    data[110] = this.torque_sensor_calibration_table_left[6][1] & 0xff;
    data[111] = this.torque_sensor_calibration_table_left[6][1] >> 8;
    data[112] = this.torque_sensor_calibration_table_left[7][0] & 0xff;
    data[113] = this.torque_sensor_calibration_table_left[7][0] >> 8;
    data[114] = this.torque_sensor_calibration_table_left[7][1] & 0xff;
    data[115] = this.torque_sensor_calibration_table_left[7][1] >> 8;
    data[116] = this.torque_sensor_calibration_table_right[0][0] & 0xff;
    data[117] = this.torque_sensor_calibration_table_right[0][0] >> 8;
    data[118] = this.torque_sensor_calibration_table_right[0][1] & 0xff;
    data[119] = this.torque_sensor_calibration_table_right[0][1] >> 8;
    data[120] = this.torque_sensor_calibration_table_right[1][0] & 0xff;
    data[121] = this.torque_sensor_calibration_table_right[1][0] >> 8;
    data[122] = this.torque_sensor_calibration_table_right[1][1] & 0xff;
    data[123] = this.torque_sensor_calibration_table_right[1][1] >> 8;
    data[124] = this.torque_sensor_calibration_table_right[2][0] & 0xff;
    data[125] = this.torque_sensor_calibration_table_right[2][0] >> 8;
    data[126] = this.torque_sensor_calibration_table_right[2][1] & 0xff;
    data[127] = this.torque_sensor_calibration_table_right[2][1] >> 8;
    data[128] = this.torque_sensor_calibration_table_right[3][0] & 0xff;
    data[129] = this.torque_sensor_calibration_table_right[3][0] >> 8;
    data[130] = this.torque_sensor_calibration_table_right[3][1] & 0xff;
    data[131] = this.torque_sensor_calibration_table_right[3][1] >> 8;
    data[132] = this.torque_sensor_calibration_table_right[4][0] & 0xff;
    data[133] = this.torque_sensor_calibration_table_right[4][0] >> 8;
    data[134] = this.torque_sensor_calibration_table_right[4][1] & 0xff;
    data[135] = this.torque_sensor_calibration_table_right[4][1] >> 8;
    data[136] = this.torque_sensor_calibration_table_right[5][0] & 0xff;
    data[137] = this.torque_sensor_calibration_table_right[5][0] >> 8;
    data[138] = this.torque_sensor_calibration_table_right[5][1] & 0xff;
    data[139] = this.torque_sensor_calibration_table_right[5][1] >> 8;
    data[140] = this.torque_sensor_calibration_table_right[6][0] & 0xff;
    data[141] = this.torque_sensor_calibration_table_right[6][0] >> 8;
    data[142] = this.torque_sensor_calibration_table_right[6][1] & 0xff;
    data[143] = this.torque_sensor_calibration_table_right[6][1] >> 8;
    data[144] = this.torque_sensor_calibration_table_right[7][0] & 0xff;
    data[145] = this.torque_sensor_calibration_table_right[7][0] >> 8;
    data[146] = this.torque_sensor_calibration_table_right[7][1] & 0xff;
    data[147] = this.torque_sensor_calibration_table_right[7][1] >> 8;
    data[148] = this.street_mode_function_enabled;
    data[149] = this.street_mode_enabled;
    data[150] = this.street_mode_enabled_on_startup;
    data[151] = this.street_mode_speed_limit;
    data[152] = this.street_mode_power_limit_div25;
    data[153] = this.street_mode_throttle_enabled;
    data[154] = this.street_mode_hotkey_enabled;
    data[155] = this.pedal_cadence_fast_stop;
    data[156] = this.throttle_virtual_step;
    data[157] = this.street_mode_enabled;
    data[158] = this.ant_device_id;

    console.log(data);
    this.data = data;
    return data;
  }
}
