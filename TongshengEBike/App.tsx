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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import { BLEService } from './BLESevice';
import { TSDZ_BLE } from './TSDZ_BLE';

export interface SliderParameterProps extends SliderProps {
  parameterName: string;
  parameterIndex: number;
}

export type DisplayView = 'settings' | 'dashboard';

const SliderComponent = (props: SliderParameterProps) => {
  const [value, setValue] = useState(props.value ?? 0);
  useEffect(() => {
    console.log(`value has changed to: ${value}`);
    // You can perform any additional actions here when 'count' changes
  }, [value]); // The second argument is an array of dependencies

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
    const ble = new TSDZ_BLE();
    ble.setupConnection();
    setInitialized(true);
  }, []); // Empty dependency array ensures it only runs once


  const buttonSize = 40;

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

  const assistButtons = useMemo(
    () => [
      {
        id: '1',
        label: 'OFF',
        color: 'black',
        labelStyle: {fontSize: 35, color: 'black'},
        containerStyle: {width: '95%', backgroundColor: 'white', padding: 20},
        value: 'off',
        size: buttonSize,
      },
      {
        id: '2',
        label: 'LOW',
        value: 'low',
        color: 'black',
        labelStyle: {fontSize: 35, color: 'black'},
        containerStyle: {width: '95%', backgroundColor: '#53af55', padding: 20},
        size: buttonSize,
      },
      {
        id: '3',
        label: 'MEDIUM',
        value: 'med',
        color: 'black',
        labelStyle: {fontSize: 35, color: 'black'},
        containerStyle: {width: '95%', backgroundColor: '#fff271', padding: 20},
        size: buttonSize,
      },
      {
        id: '4',
        label: 'HIGH',
        value: 'high',
        color: 'black',
        labelStyle: {fontSize: 35, color: 'black'},
        containerStyle: {width: '95%', backgroundColor: '#f2963b', padding: 20},
        size: buttonSize,
      },
      {
        id: '5',
        label: 'MAX',
        value: 'max',
        color: 'black',
        labelStyle: {fontSize: 35, color: 'black'},
        containerStyle: {width: '95%', backgroundColor: '#eb6d6d', padding: 20},
        size: buttonSize,
      },
    ],
    [],
  );
  const [pedalAssistMode, setPedalAssistMode] = useState<string | undefined>(
    '1',
  );
  useEffect(() => {
    console.log(`pedal assist has changed to: ${pedalAssistMode}`);
    // You can perform any additional actions here when 'count' changes
  }, [pedalAssistMode]); // The second argument is an array of dependencies

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    height: '100%',
  };

  let batteryPct = 55;
  let watts = 10;

  return (
    <SafeAreaView style={backgroundStyle}>
      <Text style={styles.header}>EBike</Text>
      {viewMode === 'dashboard' && (
        <View>
          <Text style={styles.text}>PEDAL ASSIST</Text>
          <RadioGroup
            radioButtons={assistButtons}
            onPress={setPedalAssistMode}
            selectedId={pedalAssistMode}
            layout="column"
          />
          <Text style={styles.largeHeader}>Battery : {batteryPct}%</Text>
          <Text style={styles.largeHeader}>Watts : {watts}</Text>
        </View>
      )}
      {viewMode === 'settings' && (
        <View>
          <Text style={styles.text}>PARAMETERS</Text>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={backgroundStyle}>
            <SliderComponent
              parameterName="EBIKE thing 1"
              parameterIndex={0}
              step={1}
              value={-30}
              minimumValue={-80}
              maximumValue={0}
            />
            <SliderComponent
              parameterName="EBIKE thing 2"
              parameterIndex={0}
              step={0.1}
              value={10}
              minimumValue={0}
              maximumValue={10}
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
    fontSize: 35,
    textAlign: 'center',
    fontWeight: '700',
    margin: 0,
    color: '#666e80',
    padding: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
});

export default App;
