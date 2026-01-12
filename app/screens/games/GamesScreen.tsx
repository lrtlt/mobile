import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {SafeWebView} from '../../components';
import {MainStackParamList} from '../../navigation/MainStack';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {SafeAreaView} from 'react-native-safe-area-context';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Games'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Games'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const GamesScreen: React.FC<React.PropsWithChildren<Props>> = ({route, navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Žaidimai',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useNavigationAnalytics({
    viewId: 'https://www.lrt.lt/zaidimai',
    title: `LRT Žaidimai - LRT`,
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <SafeWebView
        style={styles.webView}
        scrollEnabled={true}
        javaScriptEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        showsVerticalScrollIndicator={true}
        source={{
          uri: 'https://www.lrt.lt/zaidimai/-headless',
        }}
      />
    </SafeAreaView>
  );
};

export default GamesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});
