/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Slider, {SliderProps} from '@react-native-community/slider';
import RadioGroup from 'react-native-radio-buttons-group';
import {TSDZ_BLE} from './TSDZ_BLE';
import { Peripheral } from 'react-native-ble-manager';

export interface SliderParameterProps extends SliderProps {
  parameterName: string;
}
const ble = new TSDZ_BLE();

export type DisplayView = 'settings' | 'dashboard';

const SliderComponent = (props: SliderParameterProps) => {
  const [value, setValue] = useState(props.value ?? 0);
  useEffect(() => {
    console.log(`value has changed to: ${value}`);
    ble.writeCfg();
  }, [value]);

  return (
    <View style={styles.sliderComponent}>
      <Text style={styles.text}>
        {props.parameterName} : {value && +value.toFixed(3)}
      </Text>
      <Slider
        step={0.01}
        style={styles.slider}
        {...props}
        value={value}
        onValueChange={setValue}
      />
    </View>
  );
};

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  backgroundColor: string,
  textColor: string
}

const CustomButton = (props: CustomButtonProps) => {
  return (
    <TouchableOpacity style={StyleSheet.compose(styles.button, {backgroundColor: props.backgroundColor})} onPress={props.onPress}>
      <Text style={StyleSheet.compose(styles.buttonText, {color: props.textColor})}>{props.title}</Text>
    </TouchableOpacity>
  );
};

interface BLEDeviceProps {
  devices: Peripheral[];
}

const BLEDeviceComponent = ( props:BLEDeviceProps ) => {
    return props.devices.map((device:Peripheral, index) => (
      <View key={index} style={StyleSheet.flatten({margin: 16})}>
      <Text style={styles.smallText}>Device: {device.name}</Text>
      <Text style={styles.smallerText}>ID: {device.id}</Text>
      <TouchableOpacity style={StyleSheet.flatten({borderRadius: 4, position:'absolute', right: 75, backgroundColor: '#666e80'})} onPress={() => {ble.startConnection(device.id);}}>
      <Text style={styles.text}>CONNECT</Text>
       </TouchableOpacity>
      </View>
  ));
};


function useTimer(callback: ()=> void , delay: number) {
  useEffect(() => {
    const timer = setInterval(callback, delay);

    return () => {
      clearInterval(timer);
    };
  }, [callback, delay]);
}

function App(): JSX.Element {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    ble.setupConnection();
    setInitialized(true);
  }, []); // Empty dependency array ensures it only runs once

  const setSave = () => {
    console.log('save cfg');
    //ble.writeCfg();
  };

  const setDashboardView = () => {
    setViewMode('dashboard');
  };

  const setSettingsView = () => {
    setViewMode('settings');
  };

  const [viewMode, setViewMode] = useState<string>('dashboard');
  const [bleConnected, setBleConnected] = useState<boolean | undefined>(false);
  const [motorState, setMotorState] = useState<string | undefined>('OFF');
  const [motorTemp, setMotorTemp] = useState<number | undefined>(0);
  const [assistLevel, setAssistLevel] = useState<string | undefined>('OFF');
  const [targetAssistLevel, setTargetAssistLevel] = useState<number | undefined>(0);
  const [batteryVoltage, setBatteryVoltage] = useState<number | undefined>(0);
  const [batteryCurrent, setBatteryCurrent] = useState<number | undefined>(0);
  const [batteryResistance, setBatteryResistance] = useState<number | undefined>(0);
  const [batterySOC, setBatterySOC] = useState<number | undefined>(0);
  const [humanWatts, setHumanWatts] = useState<number | undefined>(0);
  const [motorWatts, setMotorWatts] = useState<number | undefined>(0);
  const [pedalCadence, setPedalCadence] = useState<number | undefined>(0);
  const [odometer, setOdometer] = useState<number | undefined>(0);
  const [trip, setTrip] = useState<number | undefined>(0);
  const [bleDevices, setFoundDevices] = useState<Peripheral[]>([]);


  const reRenderCallback = () => {
    // switch (ble.periodic.motorState) {
    //   case 0:
    //   setMotorState('OFF');
    //   break;
    //   case 3:
    //   setMotorState('CALIBRATING')
    //   break;
    //   case 2:
    //   setMotorState('ON');
    //   break;
    // }
    setBleConnected(ble.connected);
    if (ble.periodic.motorState === 1) {
      setMotorState('ON');
    } else if (ble.periodic.motorState === 0) {
      setMotorState('OFF');
    } else {
      setMotorState('CALIBRATING...');
    }

    switch (ble.periodic.assistLevel) {
      case 0:
        setAssistLevel('OFF');
        break;
      case 1:
        setAssistLevel('15%');
        break;
      case 2:
        setAssistLevel('30%');
        break;
      case 3:
        setAssistLevel('45%');
        break;
      case 4:
        setAssistLevel('60%');
        break;
      case 5:
        setAssistLevel('75%');
        break;
      case 6:
        setAssistLevel('90%');
        break;
      case 7:
        setAssistLevel('MAXIMUM');
        break;
    }

    setBatteryVoltage(ble.periodic.batteryVoltage);
    setBatteryCurrent(ble.periodic.batteryCurrent);
    setBatteryResistance(ble.periodic.batteryResistanceEstimated);
    setBatterySOC(ble.periodic.batterySOC);
    setHumanWatts(ble.periodic.humanPedalPower);
    setMotorWatts(ble.periodic.motorPower);
    setOdometer(ble.periodic.odometer);
    setPedalCadence(ble.periodic.pedalCadence);
    setFoundDevices(ble.peripherals);
    setTargetAssistLevel(ble.periodic.assistLevelTarget);
    setMotorTemp(ble.periodic.motorTemperature);
    setTrip(ble.periodic.tripDistance);
  };

  const timerDelay = 100;

  useTimer(reRenderCallback, timerDelay);


  return (
    <SafeAreaView style={styles.background}>
      {bleConnected === false && (
        <View>
          <Text style={styles.header}>CONNECT EBIKE BLUETOOTH</Text>
          <Text style={styles.largeHeaderLeft}>Devices</Text>
          <ScrollView style={styles.bleListScroll}>
            <BLEDeviceComponent devices={bleDevices} />
          </ScrollView>
        </View>
      )}

      {viewMode === 'dashboard' && bleConnected === true && (
        <View>
          <Text style={styles.header}>DASHBOARD</Text>

          <Text style={styles.largeHeaderLeft}>ASSIST</Text>
          <Text style={styles.detailText}>Level : {assistLevel}</Text>
          <Text style={styles.detailText}>Target : {targetAssistLevel}</Text>

          <Text style={styles.largeHeaderLeft}>BATTERY</Text>
          <Text style={styles.detailText}>Charge : {batterySOC}%</Text>
          <Text style={styles.detailText}>Voltage : {batteryVoltage} V+</Text>
          <Text style={styles.detailText}>Current : {batteryCurrent} A</Text>
          <Text style={styles.detailText}>Resistance : {batteryResistance} mΩ</Text>

          <Text style={styles.largeHeaderLeft}>MOTOR</Text>
          <Text style={styles.detailText}>State : {motorState}</Text>
          <Text style={styles.detailText}>Temperature : {motorTemp} C</Text>
          <Text style={styles.detailText}>Power : {motorWatts} Watts</Text>

          <Text style={styles.largeHeaderLeft}>HUMAN</Text>
          <Text style={styles.detailText}>Power : {humanWatts} Watts</Text>
          <Text style={styles.detailText}>Pedal Cadance : {pedalCadence}</Text>

          <Text style={styles.largeHeaderLeft}>DISTANCE</Text>
          <Text style={styles.detailText}>Trip : {trip} km</Text>
          <Text style={styles.detailText}>Odometer : {odometer} km</Text>

      </View>

      )}

      {viewMode === 'settings' && bleConnected === true && (
        <View>
          <Text style={styles.header}>SETTINGS</Text>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.background}>
            <SliderComponent
              parameterName="Wheel Perimeter"
              step={1}
              value={ble.cfg.wheel_perimeter}
              minimumValue={750}
              maximumValue={3000}
            />
            <SliderComponent
              parameterName="Max Speed"
              step={1}
              value={ble.cfg.wheel_max_speed}
              minimumValue={1}
              maximumValue={99}
            />
          </ScrollView>
          <View style={styles.saveButton}>
          <CustomButton title="Save"
          onPress={setSave}
          backgroundColor="#666e80"
          textColor="white"/>
          </View>
        </View>
      )}

      {viewMode === 'settings' || viewMode === 'dashboard' && (
        <View>
          <View style={styles.dashboardButton}>
          <CustomButton title="Dashboard"
              backgroundColor={viewMode === 'dashboard' ? '#666e80' : 'black'}
              textColor='white'
              onPress={setDashboardView} />
          </View>
          <View style={styles.settingsButton}>
          <CustomButton title="Settings"
              backgroundColor={viewMode === 'settings' ? '#666e80' : 'black'}
              textColor='white'
              onPress={setSettingsView} />
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'black',
    height: '100%',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  sliderComponent: {
    padding: 10,
    backgroundColor: 'black',
    marginTop: 10,
    width: '90%',
    marginLeft: '5%',
  },
  highlight: {
    fontWeight: '700',
  },
  slider: {
    width: '90%',
    opacity: 1,
    height: 30,
    marginLeft: '5%',
  },
  text: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '500',
    margin: 0,
    color: 'white',
    padding: 10,
  },
  smallText: {
    fontSize: 17,
    textAlign: 'left',
    fontWeight: '500',
    color: 'white',
  },
  detailText: {
    fontSize: 19,
    textAlign: 'left',
    fontWeight: '500',
    color: 'white',
    padding: 5
  },
  smallerText: {
    fontSize: 12,
    textAlign: 'left',
    fontWeight: '500',
    color: 'white',
  },
  header: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '700',
    margin: 0,
    color: '#afb2b9',
    padding: 10,
  },
  largeHeader: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: '700',
    margin: 0,
    color: 'white',
    padding: 5,
    marginTop: 5
  },
  largeHeaderLeft: {
    fontSize: 24,
    textAlign: 'left',
    fontWeight: '700',
    margin: 0,
    color: 'black',
    padding: 10,
    backgroundColor: '#666e80',
    width: '100%',
    marginTop: 5,
    marginBottom: 5
  },
  footer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    height: '100%',
    widht: '100%'
  },
  button: {
    width: '80%',
    height: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 4
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  saveButton: {
    position: 'absolute',
    left: '15%',
    top: '80%',
    width: '85%',
    height: 400,
  },
  dashboardButton: {
    position: 'absolute',
    left: '5%',
    top: '100%',
    width: '55%',
    height: 400,
    marginTop: 30
  },
  settingsButton: {
    position: 'absolute',
    left: '50%',
    top: '100%',
    width: '55%',
    height: 400,
    marginTop: 30
  },
  bleListScroll: {
    height: 700,
    width: 500,
    overflow: 'scroll',
    marginBottom: 100,
  },
  hrLine: {
    flex: 1,
    height: 1,
    width: 100,
    backgroundColor: 'white',
    margin: 10,
  },
});

export default App;
