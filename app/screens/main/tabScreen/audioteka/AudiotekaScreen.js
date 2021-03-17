import React, {useEffect, useRef} from 'react';
import {View, SectionList, RefreshControl, StyleSheet, StatusBar} from 'react-native';
import {SectionHeader, ScreenLoader, TopAudioArticle} from '../../../../components';
import {fetchAudioteka} from '../../../../redux/actions/index';
import {getOrientation} from '../../../../util/UI';
import {
  GEMIUS_VIEW_SCRIPT_ID,
  EVENT_LOGO_PRESS,
  ARTICLE_EXPIRE_DURATION,
  LIST_DATA_TYPE_TOP_AUDIO_ARTICLE,
} from '../../../../constants';
import {useDispatch, useSelector} from 'react-redux';
import Gemius from 'react-native-gemius-plugin';
import {EventRegister} from 'react-native-event-listeners';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../../../../Theme';
import {selectAudiotekaScreenState} from '../../../../redux/selectors';

const AudiotekaScreen = (props) => {
  const {isCurrent} = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const listRef = useRef(null);

  const {colors, dark} = useTheme();

  const state = useSelector(selectAudiotekaScreenState);
  const {refreshing, lastFetchTime, sections, loading} = state;

  useEffect(() => {
    Gemius.sendPartialPageViewedEvent(GEMIUS_VIEW_SCRIPT_ID, {
      page: 'audioteka',
    });
  }, []);

  useEffect(() => {
    const listener = EventRegister.addEventListener(EVENT_LOGO_PRESS, (data) => {
      if (isCurrent) {
        listRef.current?.scrollToLocation({
          animated: true,
          sectionIndex: 0,
          itemIndex: 0,
        });
        dispatch(fetchAudioteka());
      }
    });
    return () => EventRegister.removeEventListener(listener);
  });

  useEffect(() => {
    if (isCurrent) {
      if (!refreshing && Date.now() - lastFetchTime > ARTICLE_EXPIRE_DURATION) {
        console.log('Audioteka data expired!');
        dispatch(fetchAudioteka());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCurrent, refreshing, lastFetchTime]);

  const onArticlePressHandler = (article) => {
    navigation.navigate('Article', {articleId: article.id});
  };

  const onCategoryPressHandler = (category) => {
    console.log('CategoryPressed', category);
  };

  const renderItem = (val) => {
    console.log('render', val);
    switch (val.item.type) {
      case LIST_DATA_TYPE_TOP_AUDIO_ARTICLE: {
        return <TopAudioArticle article={val.item.article} />;
      }
      default: {
        console.warn('Uknown list item type: ' + val.item.type);
        return <View />;
      }
    }
  };

  if (loading) {
    return <ScreenLoader style={styles.loadingContainer} />;
  }

  return (
    <>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        translucent={false}
        backgroundColor={colors.statusBar}
      />
      <View style={styles.container}>
        <SectionList
          showsVerticalScrollIndicator={false}
          style={styles.container}
          ref={listRef}
          extraData={{
            orientation: getOrientation(),
            lastFetchTime: lastFetchTime,
          }}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => dispatch(fetchAudioteka())} />
          }
          renderSectionHeader={({section}) => {
            if (section.type === LIST_DATA_TYPE_TOP_AUDIO_ARTICLE) {
              return null;
            }

            return (
              <SectionHeader
                category={section.category}
                onPress={(category) => onCategoryPressHandler(category)}
              />
            );
          }}
          sections={sections}
          removeClippedSubviews={false}
          windowSize={12}
          updateCellsBatchingPeriod={20}
          maxToRenderPerBatch={4}
          initialNumToRender={8}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item, index) => String(index) + String(item)}
        />
      </View>
    </>
  );
};

export default AudiotekaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
