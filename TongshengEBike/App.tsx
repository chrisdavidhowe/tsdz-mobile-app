/* eslint-disable jsx-quotes */
/* eslint-disable prettier/prettier */
import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import { TSDZ_Configurations } from './TSDZ_Config';
import { TSDZ_Periodic } from './TSDZ_Periodic';

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
    setViewMode('dashboard')
  };

  const setSettingsView = () => {
    setViewMode('settings')
  };

  const viewButtons = useMemo(
    () => [
      {
        id: 'dashboard',
        label: 'DASHBOARD',
        color: 'black',
        labelStyle: {fontSize: 17, color: 'black'},
        containerStyle: {width: '45%', padding: 10, backgroundColor: '#d7dae0'},
        value: 'dashboard',
        size: 20,
      },
      {
        id: 'settings',
        label: 'SETTINGS',
        value: 'settings',
        color: 'black',
        labelStyle: {fontSize: 17, color: 'black'},
        containerStyle: {width: '45%', padding: 10, backgroundColor: '#d7dae0'},
        size: 20,
      },
    ],
    [],
  );
  const [viewMode, setViewMode] = useState<string | undefined>('dashboard');
  useEffect(() => {
    console.log(`view mode has changed to: ${viewMode}`);
  }, [viewMode]); // The second argument is an array of dependencies


  const [bleConnected, setBleConnected] = useState<boolean | undefined>(false);
  const [motorState, setMotorState] = useState<string | undefined>('OFF');
  const [assistLevel, setAssistLevel] = useState<string | undefined>('OFF');
  const [batteryVoltage, setBatteryVoltage] = useState<number | undefined>(0);
  const [batteryCurrent, setBatteryCurrent] = useState<number | undefined>(0);
  const [batteryResistance, setBatteryResistance] = useState<number | undefined>(0);
  const [batterySOC, setBatterySOC] = useState<number | undefined>(0);
  const [humanWatts, setHumanWatts] = useState<number | undefined>(0);
  const [motorWatts, setMotorWatts] = useState<number | undefined>(0);
  const [pedalCadence, setPedalCadence] = useState<number | undefined>(0);
  const [odometer, setOdometer] = useState<number | undefined>(0);


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
  };

  const timerDelay = 200;

  useTimer(reRenderCallback, timerDelay);


  return (
    <SafeAreaView style={styles.background}>
      {viewMode === 'dashboard' && (
        <View>
          <Text style={styles.text}>DASHBOARD</Text>

          {bleConnected === false && (
          <View>
            <Text style={styles.largeHeader}>Waiting for BLE connection...</Text>
          </View>
          )}

          {bleConnected === true && (
          <View>

          <Text style={styles.largeHeader}>Motor State : {motorState}</Text>

          <Text style={styles.largeHeader}>Assist Level : {assistLevel}</Text>

          <Text style={styles.largeHeader}>Battery Voltage : {batteryVoltage} V</Text>

          <Text style={styles.largeHeader}>Battery Current : {batteryCurrent} A</Text>

          <Text style={styles.largeHeader}>Battery Resistance : {batteryResistance} mΩ</Text>

          <Text style={styles.largeHeader}>Battery Charge : {batterySOC} %</Text>

          <Text style={styles.largeHeader}>Human Watts : {humanWatts} W</Text>

          <Text style={styles.largeHeader}>Motor Watts : {motorWatts} W</Text>

          <Text style={styles.largeHeader}>Pedal Cadance : {pedalCadence}</Text>

          <Text style={styles.largeHeader}>Odometer : {odometer} km</Text>

          </View>
          )}
        </View>
        
      )}
      {viewMode === 'settings' && (
        <View>
          <Text style={styles.text}>PARAMETERS</Text>
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
  header: {
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '700',
    margin: 0,
    color: '#666e80',
    padding: 10,
  },
  largeHeader: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '700',
    margin: 0,
    color: 'white',
    padding: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'black',
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
  },
  settingsButton: {
    position: 'absolute',
    left: '50%',
    top: '100%',
    width: '55%',
    height: 400,
  }
});

export default App;
