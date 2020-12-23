import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {DEFAULT_FORECAST_LOCATION} from '../../constants';
import {selectForecastLocation} from '../../redux/selectors';
import {Location} from '../../screens/weather/Types';
import {useTheme} from '../../Theme';
import {getIconForWeatherConditions} from '../../util/UI';
import TextComponent from '../text/Text';
import {Forecast, getForecast} from './ForecastApi';

interface Props {
  style?: ViewStyle;
  location?: Location;
}

const INTERVAL = 1000 * 8;

const ForecastComponent: React.FC<Props> = (props) => {
  const [forecast, setForecast] = useState<Forecast | undefined>();
  const {colors} = useTheme();

  const storedLocation = useSelector(selectForecastLocation);
  const location = props.location ? props.location : storedLocation;

  useEffect(() => {
    if (forecast) {
      if (!location || location.c === forecast.location.code) {
        return;
      }
    }

    const fetchForecast = async () => {
      const data = await getForecast(
        location ? location?.c ?? DEFAULT_FORECAST_LOCATION : DEFAULT_FORECAST_LOCATION,
      );
      setForecast(data);
    };

    fetchForecast();
    const interval = setInterval(() => fetchForecast(), INTERVAL);

    return () => clearInterval(interval);
  }, [forecast, location]);

  const f = forecast?.forecast;

  const getSunColor = (): string => {
    if (f?.localDateTime) {
      const hour = new Date(f?.localDateTime).getHours();
      if (hour > 6 && hour < 22) {
        return '#fbdf82';
      } else {
        return '#585d97';
      }
    }
    return '#fbdf82';
  };

  const temperatureText = typeof f?.airTemperature === 'number' ? `${Math.round(f.airTemperature)}°` : '-';
  const humidityText = typeof f?.relativeHumidity === 'number' ? `${f?.relativeHumidity}%` : '';
  return (
    <View style={{...styles.container, backgroundColor: colors.slugBackground, ...props.style}}>
      <TextComponent style={styles.cityText}>
        {forecast?.location.name ? forecast?.location.name : '-'}
      </TextComponent>
      <View style={{...styles.sun, borderColor: colors.background, backgroundColor: getSunColor()}} />
      <TextComponent style={styles.temperatureText}>{temperatureText}</TextComponent>
      {getIconForWeatherConditions(f?.conditionCode, 26, colors.textSecondary)}
      <TextComponent style={styles.humidityText} type="secondary">
        {humidityText}
      </TextComponent>
      {f === undefined ? <ActivityIndicator style={styles.loadingIndicator} size="small" /> : null}
    </View>
  );
};

export default ForecastComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'center',
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 8,
  },
  loadingIndicator: {
    height: 16,
  },
  cityText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
    flex: 1,
  },
  temperatureText: {
    marginLeft: 8,
    marginRight: 24,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 15,
  },
  humidityText: {
    marginLeft: 8,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
  sun: {
    width: 18,
    height: 18,
    borderRadius: 16,
    borderWidth: 3,
  },
});
