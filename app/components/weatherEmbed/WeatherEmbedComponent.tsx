import * as React from 'react';
import {StyleSheet, useWindowDimensions, ViewStyle} from 'react-native';
import WebView from 'react-native-autoheight-webview';
import {ForecastLocation} from '../../api/Types';
import {DEFAULT_FORECAST_LOCATION} from '../../constants';

interface Props {
  style?: ViewStyle;
  location?: ForecastLocation;
  horizontalPadding?: number;
}

const WeatherEmbedComponent: React.FC<Props> = (props) => {
  const {location} = props;
  const locationCode = location ? location?.c ?? DEFAULT_FORECAST_LOCATION : DEFAULT_FORECAST_LOCATION;

  const padding = props.horizontalPadding ? props.horizontalPadding * 2 : 0;
  const width = useWindowDimensions().width - padding;

  const uri = `https://www.lrt.lt/orai?embed&city=${locationCode}`;

  return (
    <WebView
      style={styles.webview}
      originWhitelist={['*']}
      cacheEnabled={false}
      scrollEnabled={false}
      containerStyle={[styles.container, props.style]}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      automaticallyAdjustContentInsets={false}
      collapsable={false}
      bounces={false}
      scalesPageToFit={true}
      viewportContent={`width=${width}, user-scalable=no`}
      startInLoadingState={true}
      source={{uri: uri}}
    />
  );
};

export default WeatherEmbedComponent;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  webview: {
    opacity: 0.99,
    minHeight: 200,
  },
});
