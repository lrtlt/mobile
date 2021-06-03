import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Forecast, WeatherEmbed} from '../../components';
import {useSelector, useDispatch} from 'react-redux';

import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import WeatherLocations from './WeatherLocations';
import ConfirmModal from './ConfirmModal';
import {setForecastLocation} from '../../redux/actions/config';
import {selectForecastLocation} from '../../redux/selectors';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {ForecastLocation} from '../../api/Types';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Weather'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Weather'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const WeatherScreen: React.FC<Props> = ({navigation}) => {
  const [selectedLocation, setSelectedLocation] = useState(useSelector(selectForecastLocation));
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const dispatch = useDispatch();

  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.weatherScreenTitle,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectLocation = useCallback((location: ForecastLocation) => {
    setSelectedLocation(location);
    setConfirmModalVisible(true);
  }, []);

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
