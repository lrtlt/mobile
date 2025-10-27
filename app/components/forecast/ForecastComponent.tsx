import React from 'react';
import {View, StyleSheet, ActivityIndicator, ViewStyle} from 'react-native';
import {ForecastLocation} from '../../api/Types';
import {DEFAULT_FORECAST_LOCATION} from '../../constants';
import {useTheme} from '../../Theme';
import {getIconForWeatherConditions} from '../../util/UI';
import TextComponent from '../text/Text';
import {useSettingsStore} from '../../state/settings_store';
import {useWeatherForecast} from '../../api/hooks/useWeatherForecast';

interface Props {
  style?: ViewStyle;
  location?: ForecastLocation;
}

const ForecastComponent: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  const storedLocation = useSettingsStore((state) => state.forecastLocation);
  const location = props.location ? props.location : storedLocation;
  const cityCode = location?.c ?? DEFAULT_FORECAST_LOCATION;
  const {data: forecast} = useWeatherForecast(cityCode);

  const f = forecast?.current?.forecast ?? forecast?.default.forecast;

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
        {forecast?.current?.location?.name ?? forecast?.default?.location?.name ?? '-'}
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
