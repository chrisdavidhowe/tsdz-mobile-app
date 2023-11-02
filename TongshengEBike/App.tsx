/* eslint-disable prettier/prettier */
import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Slider, {SliderProps} from '@react-native-community/slider';
import RadioGroup from 'react-native-radio-buttons-group';
import {TSDZ_BLE} from './TSDZ_BLE';

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

function App(): JSX.Element {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    ble.setupConnection();
    setInitialized(true);
  }, []); // Empty dependency array ensures it only runs once


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
    // ble.writeCfg();
    // ble.writePeriodic();
  }, [viewMode]); // The second argument is an array of dependencies


  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: "black",
    height: '100%',
  };

  const [blePeriodic, setBlePeriodic] = useState(ble.periodic);

  // Update the state when any ble.periodic property changes
  useEffect(() => {
    setBlePeriodic(ble.periodic);
  }, [ble.periodic]);

  return (
    <SafeAreaView style={backgroundStyle}>
      {viewMode === 'dashboard' && (
        <View>
          <Text style={styles.largeHeader}>Assist Level : {ble.periodic.assistLevel}</Text>
          <Text style={styles.largeHeader}>Assist Level Target : {ble.periodic.assistLevelTarget}</Text>
          <Text style={styles.largeHeader}>Battery Voltage : {ble.periodic.batteryVoltage} V</Text>
          <Text style={styles.largeHeader}>Battery Current : {ble.periodic.batteryCurrent} A</Text>
          <Text style={styles.largeHeader}>Battery Resistance : {ble.periodic.batteryResistanceEstimated} mΩ</Text>
          <Text style={styles.largeHeader}>Battery Charge : {ble.periodic.batterySOC} %</Text>
          <Text style={styles.largeHeader}>Human Watts : {ble.periodic.humanPedalPower} W</Text>
          <Text style={styles.largeHeader}>Motor Watts : {ble.periodic.motorPower} W</Text>
          <Text style={styles.largeHeader}>Pedal Cadance : {ble.periodic.pedalCadence}</Text>
          <Text style={styles.largeHeader}>Odometer : {ble.periodic.odometer} km</Text>

        </View>
      )}
      {viewMode === 'settings' && (
        <View>
          <Text style={styles.text}>PARAMETERS</Text>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
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
        </View>
      )}
      <View style={styles.footer}>
        <RadioGroup
          radioButtons={viewButtons}
          onPress={setViewMode}
          selectedId={viewMode}
          layout="row"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#d7dae0',
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
    color: '#666e80',
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
  },
});

export default App;
