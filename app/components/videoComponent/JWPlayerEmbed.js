import React from 'react';
import { View, Text } from 'react-native';
import WebView from 'react-native-autoheight-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EStyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
import Styles from './styles';

const JWPlayerEmbed = ({ embedUrl, autoPlay }) => {
  const renderError = () => {
    return (
      <View style={Styles.loaderContainer}>
        <Icon name="error" color="white" size={24} />
        <Text style={Styles.errorText}>{EStyleSheet.value('$videoNotAvailable')}</Text>
      </View>
    );
  };

  if (embedUrl) {
    return (
      <View style={Styles.htmlContainer}>
        <WebView
          style={Styles.embedPlayer}
          originWhitelist={['*']}
          cacheEnabled={false}
          scrollEnabled={false}
          decelerationRate="normal"
          allowsFullscreenVideo={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          androidHardwareAccelerationDisabled={false}
          geolocationEnabled={true}
          automaticallyAdjustContentInsets={false}
          mediaPlaybackRequiresUserAction={!autoPlay}
          collapsable={false}
          bounces={false}
          startInLoadingState={true}
          source={{ uri: embedUrl }}
        />
      </View>
    );
  } else {
    return renderError();
  }
};

JWPlayerEmbed.propTypes = {
  embedUrl: PropTypes.string,
  autoPlay: PropTypes.bool,
};

JWPlayerEmbed.defaultProps = {
  autoPlay: true,
};

export default React.memo(JWPlayerEmbed);
