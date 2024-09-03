import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {useTheme} from '../../Theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {fetchArticle} from '../../api';
import {ArticleContent, isMediaArticle} from '../../api/Types';
import {ScreenError, ScreenLoader, VideoComponent} from '../../components';
import PagerView from 'react-native-pager-view';

type ScreenRouteProp = RouteProp<MainStackParamList, 'VideoList'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'VideoList'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const VerticalVideoScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const [selectedIndex, setSelectedIndex] = useState(route.params.initialIndex);

  const {colors, dark} = useTheme();
  const {articles, initialIndex} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: colors.onPrimary,
      headerTitleStyle: {color: colors.onPrimary, fontSize: 16},
      headerBackground: () => <View style={{flex: 1, backgroundColor: '#000'}}></View>,
    });
  }, [route.params]);

  useFocusEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#000');

    return () => {
      StatusBar.setBarStyle(dark ? 'light-content' : 'dark-content');
      StatusBar.setBackgroundColor(colors.statusBar);
    };
  });

  //   useNavigationAnalytics({
  //     viewId: `https://www.lrt.lt/orai/${selectedLocation?.c ?? 'vilnius'}`,
  //     title: `Orai | ${selectedLocation?.n ?? 'Vilnius'} | ${
  //       selectedLocation?.ad ?? 'Vilniaus miesto sav.'
  //     } - LRT`,
  //   });

  return (
    <SafeAreaView style={styles.screen} edges={['left', 'right', 'bottom']}>
      <PagerView
        style={{flex: 1}}
        orientation="vertical"
        initialPage={initialIndex}
        offscreenPageLimit={1}
        onPageSelected={(event) => setSelectedIndex(event.nativeEvent.position)}>
        {articles.map((article, i) =>
          Math.abs(selectedIndex - i) < 1 ? (
            <View key={i} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <VideoWrapper id={article.id} />
            </View>
          ) : (
            <View key={i} />
          ),
        )}
      </PagerView>
    </SafeAreaView>
  );
};

export default VerticalVideoScreen;

const VideoWrapper: React.FC<{id: number | string}> = ({id}) => {
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');
  const [article, setArticle] = useState<ArticleContent>();

  const {strings} = useTheme();

  useEffect(() => {
    setState('loading');
    fetchArticle(id)
      .then((response) => {
        setArticle(response.article);
        setState('ok');
      })
      .catch((e) => {
        console.error(e);
        setState('error');
      });
  }, []);

  switch (state) {
    case 'loading':
      return <ScreenLoader />;
    case 'error':
      return <ScreenError text={strings.error_no_connection} />;
    case 'ok': {
      if (isMediaArticle(article)) {
        return (
          <VideoComponent
            style={styles.player}
            autoPlay={true}
            streamUrl={article.get_playlist_url}
            title={article.title}
            minifyEnabled={false}
            cover={article.main_photo}
            aspectRatio={0.562}
          />
        );
      } else {
        return <ScreenError text={strings.articleError} />;
      }
    }
  }
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000CC',
  },
  player: {
    height: '85%',
    borderRadius: 12,
    overflow: 'hidden',
  },
});
