import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, ViewStyle} from 'react-native';
import {useSelector} from 'react-redux';
import {fetchForecast} from '../../api';
import {Forecast, ForecastLocation} from '../../api/Types';
import {DEFAULT_FORECAST_LOCATION} from '../../constants';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import {selectForecastLocation} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {getIconForWeatherConditions} from '../../util/UI';
import TextComponent from '../text/Text';

interface Props {
  style?: ViewStyle;
  location?: ForecastLocation;
}

const INTERVAL = 1000 * 8;

const ForecastComponent: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const [forecast, setForecast] = useState<Forecast | undefined>();
  const {colors} = useTheme();

  const storedLocation = useSelector(selectForecastLocation);
  const location = (props.location ? props.location : storedLocation) as ForecastLocation;

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (forecast) {
      if (!location || location.c === forecast.location.code) {
        return;
      }
    }

    const callApi = async () => {
      const cityCode = location?.c ? location.c : DEFAULT_FORECAST_LOCATION;
      try {
        const response = await cancellablePromise(fetchForecast(cityCode));
        setForecast(response.current ?? response.default);
      } catch (e) {
        setForecast(undefined);
      }
    };
    callApi();
    const interval = setInterval(() => callApi(), INTERVAL);

    return () => clearInterval(interval);
  }, [cancellablePromise, forecast, location]);

  const f = forecast?.forecast;

  const getSunColor = (): string => {
    if (f?.localDateTime) {
      const hour = new Date(f?.localDateTime).getHours();
      if (hour > 6 && hour < 23) {
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
      <TextComponent style={styles.temperatureText} fontFamily="SourceSansPro-SemiBold">
        {temperatureText}
      </TextComponent>
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
    height: 36,
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  loadingIndicator: {
    height: 16,
  },
  cityText: {
    fontSize: 15,
    flex: 1,
  },
  temperatureText: {
    marginLeft: 8,
    marginRight: 24,
    fontSize: 15,
  },
  humidityText: {
    marginLeft: 8,

    fontSize: 15,
  },
  sun: {
    width: 18,
    height: 18,
    borderRadius: 16,
    borderWidth: 3,
  },
});
