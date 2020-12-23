import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Forecast, WeatherEmbed} from '../../components';
import {useSelector, useDispatch} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';

import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import WeatherLocations from './WeatherLocations';
import ConfirmModal from './ConfirmModal';
import {setForecastLocation} from '../../redux/actions/config';
import {selectForecastLocation} from '../../redux/selectors';

const WeatherScreen = (props) => {
  const [selectedLocation, setSelectedLocation] = useState(useSelector(selectForecastLocation));
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const dispatch = useDispatch();

  const {strings} = useTheme();

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: strings.weatherScreenTitle,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setConfirmModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <ScrollView style={styles.scrollContainer} nestedScrollEnabled={true}>
        <View style={styles.container}>
          <WeatherLocations style={styles.locations} onLocationSelect={(l) => handleSelectLocation(l)} />
          <Forecast style={styles.forecast} location={selectedLocation} />
          <WeatherEmbed style={styles.weatherEmbed} horizontalPadding={12} location={selectedLocation} />
        </View>
      </ScrollView>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onConfirm={() => {
          dispatch(setForecastLocation(selectedLocation));
          setConfirmModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
};

export default WeatherScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContainer: {
    minHeight: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  locations: {
    width: '100%',
    paddingVertical: 12,
  },
  forecast: {
    marginVertical: 12,
  },
  weatherEmbed: {
    marginTop: 12,
  },
});
