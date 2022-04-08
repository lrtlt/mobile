import React, {forwardRef} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView, {WebViewProps} from 'react-native-webview';
import {useTheme} from '../../Theme';

interface Props extends WebViewProps {
  allowDarkMode?: boolean;
}

/**
 * Component extending default WebView applying fixes for android crashes.
 */
const SafeWebView: React.FC<Props> = forwardRef<WebView, Props>((props, ref) => {
  const {dark} = useTheme();

  return (
    <View style={[props.style as {}, styles.webViewContainer]}>
      <WebView
        ref={ref}
        originWhitelist={['*']}
        cacheEnabled={false}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        forceDarkOn={dark && props.allowDarkMode}
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        automaticallyAdjustContentInsets={false}
        bounces={false}
        sharedCookiesEnabled={true}
        {...props}
        style={[styles.webView, props.style]}
        containerStyle={styles.webViewContainer}
      />
    </View>
  );
});

export default SafeWebView;

const styles = StyleSheet.create({
  webView: {
    /**
     * Min height & opacity solves crash issues on android while screens are animating in react-navigation
     * https://github.com/react-native-webview/react-native-webview/issues/1069
     */
    minHeight: 100,
    opacity: 0.99,
  },
  webViewContainer: {
    minHeight: 100,
    overflow: 'hidden',
  },
});
