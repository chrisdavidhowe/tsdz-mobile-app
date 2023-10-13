import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Slider, {SliderProps} from '@react-native-community/slider';

import {Colors} from 'react-native/Libraries/NewAppScreen';

export interface SliderParameterProps extends SliderProps {
  parameterName: string;
  parameterIndex: number;
}

const SliderComponent = (props: SliderParameterProps) => {
  const [value, setValue] = useState(props.value ?? 0);
  useEffect(() => {
    console.log(`value has changed to: ${value}`);
    // You can perform any additional actions here when 'count' changes
  }, [value]); // The second argument is an array of dependencies

  return (
    <View style={styles.sliderComponent}>
      <Text style={styles.text}>{props.parameterName} : {value && +value.toFixed(3)}</Text>
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
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Text style={styles.header}>EBike Parameters</Text>
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
  },
});

export default App;
