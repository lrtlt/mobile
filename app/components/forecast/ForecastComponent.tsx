import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {DEFAULT_FORECAST_LOCATION} from '../../constants';
import {selectForecastLocation} from '../../redux/selectors';
import {Location} from '../../screens/weather/Types';
import {useTheme} from '../../Theme';
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

  const temperatureText = typeof f?.airTemperature === 'number' ? `${Math.round(f.airTemperature)}°C` : '-';
  const humidityText = typeof f?.relativeHumidity === 'number' ? `${f?.relativeHumidity}%` : '';
  return (
    <View style={{...styles.container, backgroundColor: colors.slugBackground, ...props.style}}>
      <TextComponent style={styles.cityText}>
        {forecast?.location.name ? `${forecast?.location.name}:` : '-'}
      </TextComponent>
      <TextComponent style={styles.temperatureText}>{temperatureText}</TextComponent>
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
    padding: 8,
  },
  loadingIndicator: {
    height: 15,
  },
  cityText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    flex: 1,
  },
  temperatureText: {
    marginLeft: 12,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
  },
  humidityText: {
    marginLeft: 12,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
  },
});
