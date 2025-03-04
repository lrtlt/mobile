import React, {useEffect} from 'react';
import {Platform, StatusBar} from 'react-native';

import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import InfinitePager from 'react-native-infinite-pager';
import {pageInterpolatorTurnIn} from './pageInterpolator';
import VerticalVideoWrapper from './VerticalVideoWrapper';
import {ScreenError} from '../../components';

type ScreenRouteProp = RouteProp<MainStackParamList, 'VideoList'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'VideoList'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const HEADER_BACKGROUND_COLOR = '#000000';

const VerticalVideoScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {colors, strings} = useTheme();
  const {articles, initialIndex, title} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title?.toUpperCase(),
      headerTintColor: colors.onPrimary,
      headerTitleStyle: {color: colors.onPrimary, fontSize: 16},
      headerStyle: {backgroundColor: HEADER_BACKGROUND_COLOR},
    });
  }, [route.params]);

  useStatusBarChange();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000000DD',
      }}
      edges={['left', 'right', 'bottom']}>
      <InfinitePager
        style={{flex: 1}}
        pageWrapperStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        pageBuffer={1}
        vertical={false}
        pageInterpolator={pageInterpolatorTurnIn}
        initialIndex={initialIndex}
        renderPage={(props) => {
          let validIndex = ((props.index % articles.length) + articles.length) % articles.length;
          if (!articles[validIndex]) {
            console.error('Invalid index', validIndex);
            return <ScreenError text={strings.articleError} />;
          } else {
            return <VerticalVideoWrapper id={articles[validIndex].id} isActive={props.isActive} />;
          }
        }}
      />
    </SafeAreaView>
  );
};

const useStatusBarChange = () => {
  const {colors, dark} = useTheme();
  useFocusEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(HEADER_BACKGROUND_COLOR);
    }
    return () => {
      StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.statusBar);
      }
    };
  });
};

export default VerticalVideoScreen;
