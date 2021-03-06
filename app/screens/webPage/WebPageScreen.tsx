import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeWebView} from '../../components';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <SafeWebView
        style={styles.webView}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
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
  },
});
