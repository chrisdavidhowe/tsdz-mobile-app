import BleManager, {BleState, Peripheral} from 'react-native-ble-manager';
import {TSDZ_Configurations} from './TSDZ_Config';
import {TSDZ_Periodic} from './TSDZ_Periodic';
import {decode, encode} from 'base-64';
import {NativeEventEmitter, NativeModules} from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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
  connectedUid = '';
  peripherals: Peripheral[] = [];

  constructor() {
    this.cfg = new TSDZ_Configurations();
    this.periodic = new TSDZ_Periodic();
    BleManager.start({showAlert: false}).then(() => {
      console.log('Module initialized');
    });
  }

  stopDiscoverListener = BleManagerEmitter.addListener(
    'BleManagerDiscoverPeripheral',
    peripheral => {
      if (peripheral.name != null) {
        const foundId = this.peripherals.find(p => p.id === peripheral.id);
        if (!foundId) {
          this.peripherals = [...this.peripherals, peripheral];
        }
      }
    },
  );

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
    BleManager.scan([], 0, true).then(() => {
      // Success code
      console.log('Scan started');
    });
  }

  async setupConnection(): Promise<boolean> {
    const state = await BleManager.checkState();

    if (state !== BleState.On) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.setupConnection();
    }

    this.scanDevices();

    return true;
  }

  numConnectionAttempts = 0;
  numConnectionLimit = 10;

  async startConnection(uuid: string): Promise<void> {
    BleManager.stopScan();

    console.log(`connect to device ${uuid}`);
    this.connected = await this.connectDevice(uuid);
    this.connectedUid = uuid;
    console.log(`is connected? ${this.connected}`);

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
      await BleManager.connect(uuid, {});
      const peripheralInfo = await BleManager.retrieveServices(uuid);
      console.log(`discovered services`, peripheralInfo);
    } catch (err) {
      console.error(`connectDevice failed ${err}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.numConnectionAttempts++;
      return this.connectDevice(uuid);
    }
    const connectedPeripherals = await BleManager.getConnectedPeripherals();
    console.log(`connectedPeripherals`, connectedPeripherals);
    return true;
  }

  writeCfg(): void {
    this.cfg.formatData();
    try {
      BleManager.write(
        this.connectedUid,
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_CONFIG,
        this.cfg.data,
      );
    } catch (err) {
      console.error(`writeCfg ${err}`);
    }
  }

  writePeriodic(): void {
    this.periodic.formatData();
    try {
      BleManager.write(
        this.connectedUid,
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_PERIODIC,
        this.periodic.data,
      );
    } catch (err) {
      console.error(`writePeriodic ${err}`);
    }
  }

  async readCfg(): Promise<void> {
    try {
      const buffer = await BleManager.read(
        this.connectedUid,
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_CONFIG,
      );
      this.cfg.getData(buffer);
    } catch (err) {
      console.error(`readCfg ${err}`);
    }
  }

  async readPeriodic(): Promise<void> {
    try {
      const buffer = await BleManager.read(
        this.connectedUid,
        this.TSDZ_SERVICE,
        this.TSDZ_CHARACTERISTICS_PERIODIC,
      );
      this.periodic.getData(buffer);
    } catch (err) {
      console.error(`readPeriodic ${err}`);
    }
  }
}
