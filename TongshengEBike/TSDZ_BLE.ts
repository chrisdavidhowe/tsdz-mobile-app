import ByteBuffer from 'bytebuffer';
import {BLEService} from './BLESevice';
import {TSDZ_Configurations} from './TSDZ_Config';
import {TSDZ_Periodic} from './TSDZ_Periodic';

export class TSDZ_BLE {
  TAG = 'TSDZBTService';
  TSDZ_SERVICE = 'dac21400-cfdd-462f-bfaf-7f6e4ccbb45f';
  TSDZ_CHARACTERISTICS_PERIODIC = 'dac21401-cfdd-462f-bfaf-7f6e4ccbb45f';
  TSDZ_CHARACTERISTICS_CONFIG = 'dac21402-cfdd-462f-bfaf-7f6e4ccbb45f';
  CLIENT_CHARACTERISTIC_CONFIG = 'dac21402-cfdd-462f-bfaf-7f6e4ccbb45f';
  CCCD = '00002902-0000-1000-8000-00805f9b34fb';
  ADDRESS_EXTRA = 'ADDRESS';
  VALUE_EXTRA = 'VALUE';
  ACTION_START_FOREGROUND_SERVICE = 'ACTION_START_FOREGROUND_SERVICE';
  ACTION_STOP_FOREGROUND_SERVICE = 'ACTION_STOP_FOREGROUND_SERVICE';
  SERVICE_STARTED_BROADCAST = 'SERVICE_STARTED';
  SERVICE_STOPPED_BROADCAST = 'SERVICE_STOPPED';
  CONNECTION_SUCCESS_BROADCAST = 'CONNECTION_SUCCESS';
  CONNECTION_FAILURE_BROADCAST = 'CONNECTION_FAILURE';
  CONNECTION_LOST_BROADCAST = 'CONNECTION_LOST';
  TSDZ_PERIODIC_WRITE_BROADCAST = 'TSDZ_PERIODIC_WRITE';
  TSDZ_CFG_READ_BROADCAST = 'TSDZ_CFG_READ';
  TSDZ_CFG_WRITE_BROADCAST = 'TSDZ_CFG_WRITE';
  TSDZ_MOTOR_READY = 'TSDZ_MOTOR_READY';
  TSDZ_MOTOR_INITIALIZING = 'TSDZ_MOTOR_INITIALIZING';
  TSDZ_MOTOR_OFF = 'TSDZ_MOTOR_OFF';
  MAX_CONNECTION_RETRY = 10;
  cfg: TSDZ_Configurations;
  periodic: TSDZ_Periodic;

  constructor() {
    BLEService.initializeBLE();
    this.cfg = new TSDZ_Configurations();
    this.periodic = new TSDZ_Periodic();
  }

  async setupConnection(): Promise<boolean> {
    console.log(`ble setup connection`);
    await BLEService.scanDevices(device => {
      if (device.name != null) {
        console.log(`device found! name : ${device.name} id : ${device.id}`);
      }
    }, []);
    return true;
  }

  writeCfg(): void {
    this.cfg.formatData();
    try {
      BLEService.writeCharacteristicWithoutResponseForDevice(
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_CONFIG,
        this.cfg.buffer.toBase64(),
      );
    } catch (err) {
      console.error(`writeCfg ${err}`);
    }
  }

  writePeriodic(): void {
    this.periodic.formatData();
    try {
    BLEService.writeCharacteristicWithoutResponseForDevice(
      this.TSDZ_SERVICE,
      this.TSDZ_CHARACTERISTICS_PERIODIC,
      this.periodic.data.toBase64(),
    );
    } catch(err) {
        console.error(`writePeriodic ${err}`);
    }
  }

  async readCfg(): Promise<void> {
    try {
    const char = await BLEService.readCharacteristicForDevice(
      this.TSDZ_SERVICE,
      this.TSDZ_CHARACTERISTICS_CONFIG,
    );
    const buffer = ByteBuffer.fromBase64(char.value ?? '');
    this.cfg.getData(buffer);
    } catch (err) {
        console.error(`readCfg ${err}`);
    }
  }

  async readPeriodic(): Promise<void> {
    try {
    const char = await BLEService.readCharacteristicForDevice(
      this.TSDZ_SERVICE,
      this.TSDZ_CHARACTERISTICS_PERIODIC,
    );
    const buffer = ByteBuffer.fromBase64(char.value ?? '');
    this.periodic.getData(buffer);
    } catch(err) {
        console.error(`readPeriodic ${err}`);
    }
  }
}
