import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import Gemius from '../../../react-native-gemius-plugin';
import {GEMIUS_VIEW_SCRIPT_ID} from '../../constants';

const WebPageScreen = (props) => {
  const {route, navigation} = props;
  const {url, title} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title || '',
    });

    Gemius.sendPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'webPage',
      url: url,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webView}
        originWhitelist={['*']}
        cacheEnabled={false}
        scalesPageToFit={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        androidHardwareAccelerationDisabled={true}
        automaticallyAdjustContentInsets={true}
        collapsable={false}
        bounces={false}
        startInLoadingState={true}
        source={{uri: url}}
      />
    </View>
  );
};

export default WebPageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
    opacity: 0.99,
  },
});
