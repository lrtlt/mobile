import React, {useCallback} from 'react';
import {useWindowDimensions, ViewStyle} from 'react-native';
import {ForecastLocation} from '../../api/Types';
import {DEFAULT_FORECAST_LOCATION} from '../../constants';
import SafeAutoHeightWebView from '../safeWebView/SafeAutoHeightWebView';
import ScreenLoader from '../screenLoader/ScreenLoader';

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
    <SafeAutoHeightWebView
      scrollEnabled={false}
      containerStyle={props.style}
      viewportContent={`width=${width}, user-scalable=no`}
      startInLoadingState={true}
      renderLoading={useCallback(
        () => (
          <ScreenLoader />
        ),
        [],
      )}
      source={{uri: uri}}
    />
  );
};

export default WeatherEmbedComponent;
