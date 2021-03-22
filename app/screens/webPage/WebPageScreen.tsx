import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {MainStackParamList} from '../../navigation/MainStack';

type ScreenRouteProp = RouteProp<MainStackParamList, 'WebPage'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'WebPage'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const WebPageScreen: React.FC<Props> = ({route, navigation}) => {
  const {url, title} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title || '',
    });
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        style={styles.webView}
        containerStyle={styles.webViewContainer}
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
  },
  webView: {
    flex: 1,
    opacity: 0.99,
    minHeight: 200,
  },
  webViewContainer: {
    overflow: 'hidden',
  },
});
