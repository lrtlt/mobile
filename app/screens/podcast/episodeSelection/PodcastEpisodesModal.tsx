import {PropsWithChildren, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import PlayButton from '../../main/tabScreen/radioteka/components/play_button/play_button';
import {MoreArticlesButton, Text, TouchableDebounce} from '../../../components';
import Modal from 'react-native-modal';
import {useTheme} from '../../../Theme';
import {useMediaPlayer} from '../../../components/videoComponent/context/useMediaPlayer';
import {Article} from '../../../../Types';
import {FlashList, ListRenderItemInfo} from '@shopify/flash-list';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';

interface Props {
  episodes: Article[];
  visible: boolean;
  onClose: () => void;
  onPlayPress: (article: Article) => void;
}

const PodcastEpisodesModal: React.FC<PropsWithChildren<Props>> = ({
  episodes,
  visible,
  onClose,
  onPlayPress,
}) => {
  const {mediaData} = useMediaPlayer();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Podcast'>>();

  const {colors, strings} = useTheme();

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<Article>) => {
      return (
        <View style={styles.item_root}>
          <PlayButton
            style={mediaData?.title == item.title ? undefined : {backgroundColor: colors.greyBackground}}
            onPress={() => onPlayPress(item)}
          />
          <TouchableDebounce
            style={styles.item_text_container}
            onPress={() => {
              onClose();
              setTimeout(() => {
                navigation.setParams({articleId: item.id});
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
    [mediaData],
  );

  return (
    <Modal
      accessible={false}
      style={{
        flex: 1,
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
});
