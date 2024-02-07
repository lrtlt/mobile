import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {SafeWebView} from '../../components';
import {MainStackParamList} from '../../navigation/MainStack';
import {useTheme} from '../../Theme';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';

type ScreenRouteProp = RouteProp<MainStackParamList, 'WebPage'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'WebPage'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const WebPageScreen: React.FC<Props> = ({route, navigation}) => {
  const {url, title} = route.params;

  const {colors, dark} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: url,
    title: `${title} - LRT`,
  });

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor:
          Platform.select({
            android: dark ? colors.background : undefined,
          }) ?? '#F8F8F8',
      }}>
      <SafeWebView
        style={styles.webView}
        scrollEnabled={true}
        allowDarkMode={true}
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
  },
  webView: {
    flex: 1,
  },
});
