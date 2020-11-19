import React from 'react';
import {Dimensions} from 'react-native';
import WebView from 'react-native-autoheight-webview';

const buildFrame = (url) => {
  return `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>Komentarai</title>
          </head>
        <body>
          <iframe 
            src="https://www.facebook.com/plugins/comments.php?href=${url}"
            scrolling="no" 
            frameborder="0" 
            width="${Dimensions.get('window').width}"
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
      source={{html}}
    />
  );
};

export default FacebookComments;
