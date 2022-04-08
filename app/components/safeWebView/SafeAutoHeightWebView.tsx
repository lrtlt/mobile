import React, {forwardRef, useCallback} from 'react';
import {Linking} from 'react-native';
import {StyleSheet, View} from 'react-native';
import WebView, {AutoHeightWebViewProps} from 'react-native-autoheight-webview';
import {ShouldStartLoadRequest} from 'react-native-webview/lib/WebViewTypes';
import {useTheme} from '../../Theme';

interface Props extends AutoHeightWebViewProps {
  openLinksExternally?: boolean;
}

/**
 * Component extending default WebView applying fixes for android crashes.
 */
const SafeAutoHeightWebView: React.FC<Props> = forwardRef<WebView, Props>((props, ref) => {
  const {dark} = useTheme();

  const handleShouldLoadWithRequest = useCallback((request: ShouldStartLoadRequest) => {
    const isUserClickAction = request.navigationType === 'click';

    if (isUserClickAction) {
      //User clicked on the link which should redirect to other page.
      //Opening the page on the browser...
      Linking.openURL(request.url);
      return false;
    }

    return true;
  }, []);

  return (
    <View style={[props.style as {}, styles.webViewContainer]}>
      <WebView
        ref={ref}
        originWhitelist={['*']}
        cacheEnabled={false}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
        automaticallyAdjustContentInsets={false}
        bounces={false}
        forceDarkOn={dark}
        sharedCookiesEnabled={true}
        {...props}
        style={[styles.webView, props.style]}
        containerStyle={[styles.webViewContainer, props.containerStyle]}
        onShouldStartLoadWithRequest={props.openLinksExternally ? handleShouldLoadWithRequest : undefined}
      />
    </View>
  );
});

export default SafeAutoHeightWebView;

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
