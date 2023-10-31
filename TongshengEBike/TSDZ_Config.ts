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

export class TSDZ_Configurations {
  buffer = new ByteBuffer(CONFIGURATIONS_ADV_SIZE);
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
      this.torque_sensor_calibration_table_left = new Array(numCols).fill(0);
      this.torque_sensor_calibration_table_right = new Array(numCols).fill(0);
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
      this.assist_level_prct = this.assist_level_factor[this.assist_level];
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
    data.writeByte(CONFIGURATIONS_VERSION, 0); // configurations version
    data.writeByte(this.assist_level, 1);
    data.writeByte(this.wheel_perimeter & 0xff, 2);
    data.writeByte(this.wheel_perimeter >>> 8, 3);
    data.writeByte(this.wheel_max_speed, 4);
    data.writeByte(this.units_type, 5);
    data.writeByte(this.ui32_wh_x10 & 0xff, 6);
    data.writeByte(this.ui32_wh_x10 >>> 8, 7);
    data.writeByte(this.ui32_wh_x10 >>> 16, 8);
    data.writeByte(this.ui32_wh_x10 >>> 24, 9);
    data.writeByte(this.ui32_wh_x10_100_percent & 0xff, 10);
    data.writeByte(this.ui32_wh_x10_100_percent >>> 8, 11);
    data.writeByte(this.ui32_wh_x10_100_percent >>> 16, 12);
    data.writeByte(this.ui32_wh_x10_100_percent >>> 24, 13);
    data.writeByte(this.battery_soc_enable, 14);
    data.writeByte(this.target_max_battery_power_div25, 15);
    data.writeByte(this.battery_max_current, 16);
    data.writeByte(this.motor_max_current, 17);
    data.writeByte(this.motor_current_min_adc, 18);
    data.writeByte(this.field_weakening, 19);
    data.writeByte(this.ramp_up_amps_per_second_x10, 20);
    data.writeByte(this.battery_low_voltage_cut_ofx10 & 0xff, 21);
    data.writeByte(this.battery_low_voltage_cut_ofx10 >>> 8, 22);
    data.writeByte(this.motor_type, 23);
    data.writeByte(this.motor_current_control_mode, 24);
    data.writeByte(this.motor_assistance_startup_without_pedal_rotation, 25);
    data.writeByte(this.assist_level_factor[0] & 0xff, 26);
    data.writeByte(this.assist_level_factor[0] >> 8, 27);
    data.writeByte(this.assist_level_factor[1] & 0xff, 28);
    data.writeByte(this.assist_level_factor[1] >> 8, 29);
    data.writeByte(this.assist_level_factor[2] & 0xff, 30);
    data.writeByte(this.assist_level_factor[2] >> 8, 31);
    data.writeByte(this.assist_level_factor[3] & 0xff, 32);
    data.writeByte(this.assist_level_factor[3] >> 8, 33);
    data.writeByte(this.assist_level_factor[4] & 0xff, 34);
    data.writeByte(this.assist_level_factor[4] >> 8, 35);
    data.writeByte(this.assist_level_factor[5] & 0xff, 36);
    data.writeByte(this.assist_level_factor[5] >> 8, 37);
    data.writeByte(this.assist_level_factor[6] & 0xff, 38);
    data.writeByte(this.assist_level_factor[6] >> 8, 39);
    data.writeByte(this.number_oassist_levels, 40);
    data.writeByte(this.startup_motor_power_boost_feature_enabled, 41);
    data.writeByte(this.startup_motor_power_boost_always, 42);
    data.writeByte(this.startup_motor_power_boost_limit_power, 43);
    data.writeByte(this.startup_motor_power_boost_factor[0] & 0xff, 44);
    data.writeByte(this.startup_motor_power_boost_factor[0] >> 8, 45);
    data.writeByte(this.startup_motor_power_boost_factor[1] & 0xff, 46);
    data.writeByte(this.startup_motor_power_boost_factor[1] >> 8, 47);
    data.writeByte(this.startup_motor_power_boost_factor[2] & 0xff, 48);
    data.writeByte(this.startup_motor_power_boost_factor[2] >> 8, 49);
    data.writeByte(this.startup_motor_power_boost_factor[3] & 0xff, 50);
    data.writeByte(this.startup_motor_power_boost_factor[3] >> 8, 51);
    data.writeByte(this.startup_motor_power_boost_factor[4] & 0xff, 52);
    data.writeByte(this.startup_motor_power_boost_factor[4] >> 8, 53);
    data.writeByte(this.startup_motor_power_boost_factor[5] & 0xff, 54);
    data.writeByte(this.startup_motor_power_boost_factor[5] >> 8, 55);
    ///IS THIS RIGHT??
    data.writeByte(this.startup_motor_power_boost_factor[6] & 0xff, 159);
    data.writeByte(this.startup_motor_power_boost_factor[6] >> 8, 160);

    data.writeByte(this.startup_motor_power_boost_time, 56);
    data.writeByte(this.startup_motor_power_boost_fade_time, 57);
    data.writeByte(this.temperature_limit_feature_enabled, 58);
    data.writeByte(this.motor_temperature_min_value_to_limit, 59);
    data.writeByte(this.motor_temperature_max_value_to_limit, 60);
    data.writeByte(this.coast_brake_enable, 61);
    data.writeByte(this.coast_brake_adc, 62);
    data.writeByte(this.battery_voltage_reset_wh_counter_x10 & 0xff, 63);
    data.writeByte(this.battery_voltage_reset_wh_counter_x10 >> 8, 64);
    data.writeByte(this.system_power_oftime_minutes, 65);
    data.writeByte(this.battery_pack_resistance_x1000 & 0xff, 66);
    data.writeByte(this.battery_pack_resistance_x1000 >> 8, 67);
    data.writeByte(this.ui32_odometer_x10 & 0xff, 68);
    data.writeByte((this.ui32_odometer_x10 >> 8) & 0xff, 69);
    data.writeByte((this.ui32_odometer_x10 >> 16) & 0xff, 70);
    data.writeByte((this.ui32_odometer_x10 >> 24) & 0xff, 71);
    data.writeByte(this.walk_assist_feature_enabled, 72);
    data.writeByte(this.walk_assist_level_factor[0], 73);
    data.writeByte(this.walk_assist_level_factor[1], 74);
    data.writeByte(this.walk_assist_level_factor[2], 75);
    data.writeByte(this.walk_assist_level_factor[3], 76);
    data.writeByte(this.walk_assist_level_factor[4], 77);
    data.writeByte(this.walk_assist_level_factor[5], 78);
    data.writeByte(this.walk_assist_level_factor[6], 79);
    data.writeByte(this.torque_sensor_calibration_feature_enabled, 80);
    data.writeByte(this.torque_sensor_calibration_pedal_ground, 81);
    data.writeByte(this.torque_sensor_filter, 82);
    data.writeByte(this.torque_sensor_adc_threshold, 83);
    data.writeByte(this.torque_sensor_calibration_table_left[0][0] & 0xff, 84);
    data.writeByte(this.torque_sensor_calibration_table_left[0][0] >> 8, 85);
    data.writeByte(this.torque_sensor_calibration_table_left[0][1] & 0xff, 86);
    data.writeByte(this.torque_sensor_calibration_table_left[0][1] >> 8, 87);
    data.writeByte(this.torque_sensor_calibration_table_left[1][0] & 0xff, 88);
    data.writeByte(this.torque_sensor_calibration_table_left[1][0] >> 8, 89);
    data.writeByte(this.torque_sensor_calibration_table_left[1][1] & 0xff, 90);
    data.writeByte(this.torque_sensor_calibration_table_left[1][1] >> 8, 91);
    data.writeByte(this.torque_sensor_calibration_table_left[2][0] & 0xff, 92);
    data.writeByte(this.torque_sensor_calibration_table_left[2][0] >> 8, 93);
    data.writeByte(this.torque_sensor_calibration_table_left[2][1] & 0xff, 94);
    data.writeByte(this.torque_sensor_calibration_table_left[2][1] >> 8, 95);
    data.writeByte(this.torque_sensor_calibration_table_left[3][0] & 0xff, 96);
    data.writeByte(this.torque_sensor_calibration_table_left[3][0] >> 8, 97);
    data.writeByte(this.torque_sensor_calibration_table_left[3][1] & 0xff, 98);
    data.writeByte(this.torque_sensor_calibration_table_left[3][1] >> 8, 99);
    data.writeByte(this.torque_sensor_calibration_table_left[4][0] & 0xff, 100);
    data.writeByte(this.torque_sensor_calibration_table_left[4][0] >> 8, 101);
    data.writeByte(this.torque_sensor_calibration_table_left[4][1] & 0xff, 102);
    data.writeByte(this.torque_sensor_calibration_table_left[4][1] >> 8, 103);
    data.writeByte(this.torque_sensor_calibration_table_left[5][0] & 0xff, 104);
    data.writeByte(this.torque_sensor_calibration_table_left[5][0] >> 8, 105);
    data.writeByte(this.torque_sensor_calibration_table_left[5][1] & 0xff, 106);
    data.writeByte(this.torque_sensor_calibration_table_left[5][1] >> 8, 107);
    data.writeByte(this.torque_sensor_calibration_table_left[6][0] & 0xff, 108);
    data.writeByte(this.torque_sensor_calibration_table_left[6][0] >> 8, 109);
    data.writeByte(this.torque_sensor_calibration_table_left[6][1] & 0xff, 110);
    data.writeByte(this.torque_sensor_calibration_table_left[6][1] >> 8, 111);
    data.writeByte(this.torque_sensor_calibration_table_left[7][0] & 0xff, 112);
    data.writeByte(this.torque_sensor_calibration_table_left[7][0] >> 8, 113);
    data.writeByte(this.torque_sensor_calibration_table_left[7][1] & 0xff, 114);
    data.writeByte(this.torque_sensor_calibration_table_left[7][1] >> 8, 115);
    data.writeByte(
      this.torque_sensor_calibration_table_right[0][0] & 0xff,
      116,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[0][0] >> 8, 117);
    data.writeByte(
      this.torque_sensor_calibration_table_right[0][1] & 0xff,
      118,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[0][1] >> 8, 119);
    data.writeByte(
      this.torque_sensor_calibration_table_right[1][0] & 0xff,
      120,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[1][0] >> 8, 121);
    data.writeByte(
      this.torque_sensor_calibration_table_right[1][1] & 0xff,
      122,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[1][1] >> 8, 123);
    data.writeByte(
      this.torque_sensor_calibration_table_right[2][0] & 0xff,
      124,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[2][0] >> 8, 125);
    data.writeByte(
      this.torque_sensor_calibration_table_right[2][1] & 0xff,
      126,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[2][1] >> 8, 127);
    data.writeByte(
      this.torque_sensor_calibration_table_right[3][0] & 0xff,
      128,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[3][0] >> 8, 129);
    data.writeByte(
      this.torque_sensor_calibration_table_right[3][1] & 0xff,
      130,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[3][1] >> 8, 131);
    data.writeByte(
      this.torque_sensor_calibration_table_right[4][0] & 0xff,
      132,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[4][0] >> 8, 133);
    data.writeByte(
      this.torque_sensor_calibration_table_right[4][1] & 0xff,
      134,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[4][1] >> 8, 135);
    data.writeByte(
      this.torque_sensor_calibration_table_right[5][0] & 0xff,
      136,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[5][0] >> 8, 137);
    data.writeByte(
      this.torque_sensor_calibration_table_right[5][1] & 0xff,
      138,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[5][1] >> 8, 139);
    data.writeByte(
      this.torque_sensor_calibration_table_right[6][0] & 0xff,
      140,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[6][0] >> 8, 141);
    data.writeByte(
      this.torque_sensor_calibration_table_right[6][1] & 0xff,
      142,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[6][1] >> 8, 143);
    data.writeByte(
      this.torque_sensor_calibration_table_right[7][0] & 0xff,
      144,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[7][0] >> 8, 145);
    data.writeByte(
      this.torque_sensor_calibration_table_right[7][1] & 0xff,
      146,
    );
    data.writeByte(this.torque_sensor_calibration_table_right[7][1] >> 8, 147);
    data.writeByte(this.street_mode_function_enabled, 148);
    data.writeByte(this.street_mode_enabled, 149);
    data.writeByte(this.street_mode_enabled_on_startup, 150);
    data.writeByte(this.street_mode_speed_limit, 151);
    data.writeByte(this.street_mode_power_limit_div25, 152);
    data.writeByte(this.street_mode_throttle_enabled, 153);
    data.writeByte(this.street_mode_hotkey_enabled, 154);
    data.writeByte(this.pedal_cadence_fast_stop, 155);
    data.writeByte(this.throttle_virtual_step, 156);
    data.writeByte(this.street_mode_enabled, 157);
    data.writeByte(this.ant_device_id, 158);

    console.log(data.toHex());
    console.log(`wheel permiter ${this.wheel_perimeter}`);
    return data;
  }
}
