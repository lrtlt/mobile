import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeWebView} from '../../components';
import {MainStackParamList} from '../../navigation/MainStack';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';

const _html = `
<link rel="stylesheet" href="https://web.braintainment.com/pub/config/lrt/css/custom_client.css"> 
<div id="puzzle-portal" data-customerid="lrt" data-playerpath="https://www.lrt.lt/projektai/zaidimai"></div> 
<script type="text/javascript" data-wlpp-bundle="portal" 
   src="https://web.braintainment.com/pub/bundle-loader/bundle-loader.js">
</script>
`;

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
    <View style={styles.container}>
      <SafeWebView
        style={styles.webView}
        scrollEnabled={true}
        allowDarkMode={true}
        onLoad={console.log}
        showsVerticalScrollIndicator={true}
        source={require('./index.html')}
      />
    </View>
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
