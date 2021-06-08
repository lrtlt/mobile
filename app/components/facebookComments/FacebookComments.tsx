import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import SafeWebView from '../safeWebView/SafeWebView';
import ScreenLoader from '../screenLoader/ScreenLoader';

const buildFrame = (url: string) => {
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

interface Props {
  url: string;
}

const FacebookComments: React.FC<Props> = (props) => {
  const html = buildFrame(props.url);
  return (
    <SafeWebView
      style={styles.webView}
      startInLoadingState={true}
      renderLoading={useCallback(() => {
        return <ScreenLoader />;
      }, [])}
      source={{html}}
    />
  );
};

export default FacebookComments;

const styles = StyleSheet.create({
  webView: {
    flex: 1,
  },
});
