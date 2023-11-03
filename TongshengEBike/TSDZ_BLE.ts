import {Device, State} from 'react-native-ble-plx';
import {BLEService} from './BLESevice';
import {TSDZ_Configurations} from './TSDZ_Config';
import {TSDZ_Periodic} from './TSDZ_Periodic';
import {decode, encode} from 'base-64';

export class TSDZ_BLE {
  TAG = 'TSDZBTService';
  TSDZ_SERVICE = 'dac21400-cfdd-462f-bfaf-7f6e4ccbb45f';
  TSDZ_CHARACTERISTICS_PERIODIC = 'dac21401-cfdd-462f-bfaf-7f6e4ccbb45f';
  TSDZ_CHARACTERISTICS_CONFIG = 'dac21402-cfdd-462f-bfaf-7f6e4ccbb45f';
  CLIENT_CHARACTERISTIC_CONFIG = 'dac21403-cfdd-462f-bfaf-7f6e4ccbb45f';
  CCCD = '00002902-0000-1000-8000-00805f9b34fb';
  TSDZ_WIRELESS_DEVICE = '882A6E01-BFA2-6F7A-710D-FA37E11EC3EF';
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
  foundTSDZ = false;
  connected = false;
  foundDevices: Device[] = [];

  constructor() {
    this.cfg = new TSDZ_Configurations();
    this.periodic = new TSDZ_Periodic();
  }

  base64ToByteArray(base64: string): number[] {
    const binaryString = decode(base64);
    const byteArray = new Array<number>(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  }

  byteArrayToBase64(byteArray: number[]): string {
    let binaryString = '';
    byteArray.forEach(byte => {
      binaryString += String.fromCharCode(byte);
    });
    return encode(binaryString);
  }

  async scanDevices(): Promise<void> {
    console.log('scanDevices');
    return BLEService.scanDevices(device => {
      if (device.name != null) {

        const newDevice = this.foundDevices.find(dev => dev.id === device.id);
        if (!newDevice) {
          this.foundDevices = [...this.foundDevices, device];
        }
        //console.log(`name ${device.name} id ${device.id}`);
        // if (device.name.includes('TSDZ')) {
        //   console.log('Found TSDZ!');
        //   this.foundTSDZ = true;
        //   this.TSDZ_WIRELESS_DEVICE = device.id;
        //   return;
        // }
      }
    }, []);
  }

  async setupConnection(): Promise<boolean> {
    const state = await BLEService.getState();

    if (state !== State.PoweredOn) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.setupConnection();
    }

    console.log('initialized BLE');
    BLEService.initializeBLE();

    this.scanDevices();

    while (!this.foundTSDZ) {
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    }

    return true;
  }

  numConnectionAttempts = 0;
  numConnectionLimit = 10;

  async startConnection(uuid: string): Promise<void> {
    console.log(`connect to device ${uuid}`);
    this.connected = await this.connectDevice(uuid);
    console.log(`is connected? ${this.connected}`);

    console.log(`discover services`);
    await BLEService.discoverAllServicesAndCharacteristicsForDevice();

    const chars = await BLEService.getCharacteristicsForDevice(uuid);
    console.log(`charactersitcs -> `, chars);

    this.pollPeriodic();
  }

  async pollPeriodic(): Promise<void> {
    await this.readPeriodic();
    setTimeout(() => {
      this.pollPeriodic();
    }, 1000);
  }

  async connectDevice(uuid: string): Promise<boolean> {
    if (this.numConnectionAttempts > 10) {
      this.numConnectionAttempts = 0;
      return false;
    }
    try {
      console.log(`connectToDevice(${uuid})`);
      const device = await BLEService.connectToDevice(uuid);
    } catch (err) {
      console.error(`connectDevice failed ${err}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.numConnectionAttempts++;
      return this.connectDevice(uuid);
    }
    return BLEService.device?.isConnected() ?? false;
  }

  writeCfg(): void {
    this.cfg.formatData();
    try {
      BLEService.writeCharacteristicWithoutResponseForDevice(
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_CONFIG,
        this.byteArrayToBase64(this.cfg.data),
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
        this.byteArrayToBase64(this.periodic.data),
      );
    } catch (err) {
      console.error(`writePeriodic ${err}`);
    }
  }

  async readCfg(): Promise<void> {
    try {
      const char = await BLEService.readCharacteristicForDevice(
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_CONFIG,
      );
      const buffer = this.base64ToByteArray(char.value ?? '');
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
      const buffer = this.base64ToByteArray(char.value ?? '');
      this.periodic.getData(buffer);
    } catch (err) {
      console.error(`readPeriodic ${err}`);
    }
  }

  async setupPeriodic(): Promise<void> {
    BLEService.setupMonitor(
      this.TSDZ_SERVICE,
      this.TSDZ_CHARACTERISTICS_PERIODIC,
      char => {
        const buffer = this.base64ToByteArray(char.value ?? '');
        this.periodic.getData(buffer);
      },
      err => {
        console.log(`setupPeriodic error:  ${err}`);
      },
    );
  }
}
