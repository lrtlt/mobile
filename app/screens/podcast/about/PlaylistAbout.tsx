import React, {PropsWithChildren, useCallback, useState} from 'react';
import {ArticlePhotoType, Keyword} from '../../../api/Types';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../Theme';
import TextComponent from '../../../components/text/Text';
import Divider from '../../../components/divider/Divider';
import {TouchableDebounce} from '../../../components';
import FastImage from 'react-native-fast-image';
import ArticleParagraph from '../../../components/articleParagraphs/paragraph/ArticleParagraph';
import ArticleKeywords from '../../article/keywords/ArticleKeywords';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';

interface Props {
  episodeInfo: string;
  playlistInfo: string;
  playlistImage?: ArticlePhotoType;
  keywords: Keyword[];
}

type ContentType = 'episode' | 'playlist';

const PlaylistAbout: React.FC<PropsWithChildren<Props>> = ({
  episodeInfo,
  playlistInfo,
  playlistImage,
  keywords,
}) => {
  const [selectedContent, setSelectedContent] = useState<ContentType>('episode');

  const {strings, colors} = useTheme();

  const onEpisodePressHandler = useCallback(() => {
    setSelectedContent('episode');
  }, []);

  const onShowPressHandler = useCallback(() => {
    setSelectedContent('playlist');
  }, []);

  const Tab = useCallback(
    ({label, selected}: {label: string; selected: boolean}) => (
      <View style={[styles.tab, {backgroundColor: selected ? colors.background : 'transparent'}]}>
        <TextComponent style={styles.tabLabel}>{label}</TextComponent>
      </View>
    ),
    [],
  );

  const EpisodeInfo = useCallback(() => {
    return (
      <>
        <View pointerEvents="none">
          <ArticleParagraph htmlText={episodeInfo} textSize={16} />
        </View>
      </>
    );
  }, [episodeInfo]);

  const ShowInfo = useCallback(() => {
    return (
      <>
        <View style={[styles.row, {gap: 8, marginVertical: 8, alignItems: 'flex-start'}]}>
          <FastImage
            style={{...styles.podcastDetailsImage, aspectRatio: playlistImage?.w_h}}
            source={{
              uri: buildArticleImageUri(IMG_SIZE_M, playlistImage?.path),
            }}
          />
          <View style={{flex: 1}}>
            <ArticleParagraph htmlText={playlistInfo} textSize={16} />
          </View>
        </View>
      </>
    );
  }, [playlistInfo]);

  return (
    <View style={styles.root}>
      <View style={[styles.row, {gap: 8, marginVertical: 12}]}>
        <TouchableDebounce onPress={onEpisodePressHandler}>
          <Tab label={strings.about_episode} selected={selectedContent == 'episode'} />
        </TouchableDebounce>
        <TouchableDebounce onPress={onShowPressHandler}>
          <Tab label={strings.about_playlist} selected={selectedContent == 'playlist'} />
        </TouchableDebounce>
      </View>
      <Divider />
      <View style={{paddingTop: 12}}>{selectedContent === 'episode' ? <EpisodeInfo /> : <ShowInfo />}</View>
      <ArticleKeywords keywords={keywords} />
    </View>
  );
};

export default PlaylistAbout;

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    padding: 10,
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: 13,
  },
  caption: {
    fontSize: 12,
  },
  podcastDetailsImage: {
    width: 100,
    height: 100,
    marginTop: 12,
    borderRadius: 4,
    borderColor: '#FFF',
    borderWidth: 2,
  },
});
