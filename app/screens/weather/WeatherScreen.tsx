import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Forecast, MyScrollView, WeatherEmbed} from '../../components';
import {useSelector, useDispatch} from 'react-redux';

import {useTheme} from '../../Theme';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import WeatherLocations from './WeatherLocations';
import ConfirmModal from './ConfirmModal';
import {setForecastLocation} from '../../redux/actions/config';
import {selectForecastLocation} from '../../redux/selectors';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {ForecastLocation} from '../../api/Types';
import useFetchWeatherArticles from './useFetchWeatherArticles';
import SlugArticlesBlock from '../main/tabScreen/home/blocks/SlugArticlesBlock/SlugArticlesBlock';

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

  const articles = useFetchWeatherArticles();

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

  const {bottom} = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right']}>
      <MyScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{paddingBottom: bottom}}
        nestedScrollEnabled={true}>
        <View>
          <View style={styles.container}>
            <WeatherLocations style={styles.locations} onLocationSelect={(l) => handleSelectLocation(l)} />
            <Forecast style={styles.forecast} location={selectedLocation} />
            <WeatherEmbed style={styles.weatherEmbed} horizontalPadding={8} location={selectedLocation} />
          </View>
          {articles && articles.length > 0 && (
            <SlugArticlesBlock
              block={{
                type: 'slug',
                template_id: -1,
                data: {
                  articles_list: articles,
                  is_slug_block: 1,
                  slug_title: 'Orai',
                  slug_url: 'orai',
                  template_id: -1,
                },
              }}
            />
          )}
        </View>
      </MyScrollView>
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
    padding: 8,
  },
  locations: {
    width: '100%',
    paddingVertical: 16,
  },
  forecast: {
    marginVertical: 16,
  },
  weatherEmbed: {
    flex: 1,
    marginTop: 16,
    marginBottom: 100,
  },
});
