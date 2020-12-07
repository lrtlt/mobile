import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {Forecast, getForecast} from './ForecastApi';

interface Props {}

const INTERVAL = 1000 * 8;

const ForecastComponent: React.FC<Props> = (props) => {
  const [forecast, setForecast] = useState<Forecast | undefined>();
  const {colors} = useTheme();

  useEffect(() => {
    if (forecast) {
      return;
    }

    const fetchForecast = async () => {
      const data = await getForecast('vilnius');
      setForecast(data);
    };

    fetchForecast();
    const interval = setInterval(() => fetchForecast(), INTERVAL);

    return () => clearInterval(interval);
  }, [forecast]);

  const f = forecast?.forecast;

  return (
    <View style={{...styles.container, backgroundColor: colors.slugBackground}}>
      <TextComponent style={styles.cityText}>
        {forecast?.location.name ? `${forecast?.location.name}:` : '-'}
      </TextComponent>
      <TextComponent style={styles.temperatureText}>
        {f?.airTemperature ? `${f?.airTemperature}°C` : '-'}
      </TextComponent>
      <TextComponent style={styles.humidityText} type="secondary">
        {f?.relativeHumidity ? `${f?.relativeHumidity}%` : ''}
      </TextComponent>
      {f === undefined ? <ActivityIndicator style={styles.loadingIndicator} size="small" /> : null}
    </View>
  );
};

export default ForecastComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 8,
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
