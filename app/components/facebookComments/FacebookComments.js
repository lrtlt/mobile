import React from 'react';
import {StyleSheet} from 'react-native';
import WebView from 'react-native-webview';

const buildFrame = (url) => {
  return `<!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          </head>
        <body>
          <iframe 
            src="https://www.facebook.com/plugins/comments.php?href=${url}&locale=lt_LT&mobile=true&numposts=10&order_by=reverse_time&sdk=joey&version=v4.0"
            scrolling="no" 
            frameborder="0" 
            width="100%"
            height="5000"
            style="border:none; overflow:hidden;"
            allowTransparency="true">
          </iframe>
        </body>
        </html>`;
};

const FacebookComments = (props) => {
  const html = buildFrame(props.url);
  return (
    <WebView
      style={styles.webView}
      containerStyle={styles.webViewContainer}
      originWhitelist={['*']}
      cacheEnabled={false}
      scrollEnabled={true}
      showsVerticalScrollIndicator={true}
      domStorageEnabled={true}
      javaScriptEnabled={true}
      androidHardwareAccelerationDisabled={true}
      automaticallyAdjustContentInsets={true}
      collapsable={false}
      bounces={false}
      startInLoadingState={true}
      source={{html}}
    />
  );
};

export default FacebookComments;

const styles = StyleSheet.create({
  webView: {
    opacity: 0.99,
    minHeight: 200,
    flex: 1,
  },
  webViewContainer: {
    overflow: 'hidden',
  },
});
