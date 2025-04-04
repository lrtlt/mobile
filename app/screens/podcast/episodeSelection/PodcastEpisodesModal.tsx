import {PropsWithChildren, useCallback, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import PlayButton from '../../main/tabScreen/radioteka/components/play_button/play_button';
import {MoreArticlesButton, Text, TouchableDebounce} from '../../../components';
import Modal from 'react-native-modal';
import {themeLight, useTheme} from '../../../Theme';
import {useMediaPlayer} from '../../../components/videoComponent/context/useMediaPlayer';
import {Article} from '../../../../Types';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {ArticleSeasonInfo} from '../../../api/Types';
import useSeason from './useSeason';
import ArticlePlaylist from '../../../components/videoComponent/context/playlist/ArticlePlaylist';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  seasons?: ArticleSeasonInfo[];
  currentSeason?: ArticleSeasonInfo;
  preloadedEpisodes?: Article[];
  visible: boolean;
  onClose: () => void;
  onEpisodePress: (episode: Article) => void;
}

const PodcastEpisodesModal: React.FC<PropsWithChildren<Props>> = ({
  seasons,
  currentSeason,
  preloadedEpisodes,
  visible,
  onClose,
  onEpisodePress,
}) => {
  const [selectedSeasonUrl, setSelectedSeasonUrl] = useState<string | undefined>(
    currentSeason?.season_url ?? (seasons && seasons.length > 0) ? seasons![0].season_url : undefined,
  );

  const {mediaData} = useMediaPlayer();
  const {episodes} = useSeason(selectedSeasonUrl, preloadedEpisodes);
  const {setPlaylist} = useMediaPlayer();

  const {colors, strings} = useTheme();

  const play = useCallback(
    (id: number) => {
      setPlaylist(
        new ArticlePlaylist(
          episodes.map((episode) => episode.id),
          episodes.findIndex((episode) => episode.id == id),
        ),
      );
    },
    [episodes, setPlaylist],
  );

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<Article>) => {
      return (
        <View style={styles.item_root}>
          <PlayButton
            style={mediaData?.title == item.title ? undefined : {backgroundColor: colors.greyBackground}}
            onPress={() => play(item.id)}
          />
          <TouchableDebounce
            style={styles.item_text_container}
            onPress={() => {
              onClose();
              setTimeout(() => {
                onEpisodePress(item);
              }, 200);
            }}>
            <View style={styles.item_text_container}>
              <Text style={styles.item_title} fontFamily="PlayfairDisplay-Regular">
                {item.title}
              </Text>
              <Text>{item.category_title}</Text>
              {item.item_date && (
                <Text style={styles.item_caption} type="secondary">
                  {item.item_date}
                </Text>
              )}
              <Text style={styles.item_caption}>{item.media_duration}</Text>
            </View>
          </TouchableDebounce>
        </View>
      );
    },
    [mediaData, play],
  );

  const {top, bottom} = useSafeAreaInsets();

  return (
    <Modal
      accessible={false}
      style={{
        flex: 1,
        paddingTop: top,
        paddingBottom: bottom,
      }}
      isVisible={visible}
      useNativeDriver={true}
      coverScreen={true}
      backdropOpacity={1}
      onBackButtonPress={onClose}>
      <View style={[styles.root, {backgroundColor: colors.background}]}>
        <FlashList
          data={episodes}
          extraData={mediaData}
          ListHeaderComponent={
            seasons && seasons.length ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.seasons_container}>
                  {seasons?.map((s) => {
                    return (
                      <TouchableDebounce
                        key={s.season_url}
                        style={[
                          styles.season_button,
                          {
                            backgroundColor:
                              selectedSeasonUrl === s.season_url
                                ? colors.radiotekaPlayButton
                                : colors.darkGreyBackground,
                          },
                        ]}
                        onPress={() => {
                          setSelectedSeasonUrl(s.season_url);
                        }}>
                        <Text style={(styles.season_button_text, {color: themeLight.colors.text})}>
                          {s.season_title}
                        </Text>
                      </TouchableDebounce>
                    );
                  })}
                </View>
              </ScrollView>
            ) : null
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={200}
        />
        <View style={{padding: 12}}>
          <MoreArticlesButton onPress={onClose} customText={strings.close} />
        </View>
      </View>
    </Modal>
  );
};

export default PodcastEpisodesModal;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  item_root: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  item_text_container: {
    flex: 1,
    gap: 4,
  },
  item_title: {
    fontSize: 17,
  },
  item_caption: {
    fontSize: 13,
  },
  seasons_container: {
    flexDirection: 'row',
    padding: 12,
    gap: 16,
  },
  season_button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 3,
  },
  season_button_text: {
    fontSize: 14,
  },
});
