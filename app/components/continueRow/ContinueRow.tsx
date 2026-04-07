import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Text from '../text/Text';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {IconClose} from '../svg';
import {useTheme} from '../../Theme';
import {MainStackParamList} from '../../navigation/MainStack';
import {
  PlaybackMediaType,
  PlaybackProgressEntry,
  usePlaybackProgressStore,
  useResumableAudio,
  useResumableVideo,
} from '../../state/playback_progress_store';
import {buildArticleImageUri, IMG_SIZE_M} from '../../util/ImageUtil';
import {useSearchArticlesByIds} from '../../api/hooks/useSearchArticles';

const CARD_WIDTH = Math.min(Dimensions.get('window').width * 0.5, 300);

type ContinuePlayItem = PlaybackProgressEntry & {
  title: string;
  category_title?: string;
  photo?: string;
};

interface Props {
  mediaType: PlaybackMediaType;
}

const ContinueRow: React.FC<Props> = ({mediaType}) => {
  const {colors, strings} = useTheme();

  const audioEntries = useResumableAudio();
  const videoEntries = useResumableVideo();
  const entries = mediaType === 'audio' ? audioEntries : videoEntries;

  const articleIds = useMemo(() => entries.map((e) => e.articleId), [entries]);
  const {data: searchData} = useSearchArticlesByIds(articleIds.length > 0 ? articleIds : undefined);

  const enrichedEntries = useMemo(() => {
    const articlesById = new Map(searchData?.items?.map((item) => [item.id, item]));
    return entries.map((entry) => {
      const article = articlesById.get(entry.articleId);
      return {
        ...entry,
        title: article?.title ?? '',
        category_title: article?.category_title,
        photo: article?.photo,
      };
    });
  }, [entries, searchData]);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const listRef = useRef<FlatList>(null);

  const onItemPress = useCallback(
    (entry: ContinuePlayItem) => {
      if (entry.mediaType === 'audio') {
        navigation.push('Podcast', {articleId: entry.articleId});
      } else {
        navigation.push('Vodcast', {articleId: entry.articleId});
      }
    },
    [navigation],
  );

  const onRemovePress = useCallback((entry: ContinuePlayItem) => {
    usePlaybackProgressStore.getState().removeProgress(entry.articleId);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: ContinuePlayItem}) => {
      const imageUri = item.photo ? buildArticleImageUri(IMG_SIZE_M, item.photo) : undefined;
      const isAudio = mediaType === 'audio';
      return (
        <TouchableDebounce style={styles.card} onPress={() => onItemPress(item)} activeOpacity={0.8}>
          <View style={[styles.imageContainer, isAudio && styles.imageContainerAudio]}>
            {imageUri && <FastImage source={{uri: imageUri}} style={styles.image} resizeMode="cover" />}
            <TouchableDebounce
              style={styles.removeButton}
              onPress={() => onRemovePress(item)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <View style={styles.removeButtonInner}>
                <IconClose size={10} color="#FFF" />
              </View>
            </TouchableDebounce>
            <View style={[styles.progressBarTrack, {backgroundColor: '#FFF'}]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.playerIcons,
                    width: `${Math.max(2, item.progressPct * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
          <View style={styles.contentContainer}>
            {item.category_title && (
              <Text
                type="secondary"
                fontFamily="SourceSansPro-Regular"
                style={styles.category}
                numberOfLines={1}>
                {item.category_title}
              </Text>
            )}
            <Text type="primary" fontFamily="PlayfairDisplay-Regular" style={styles.title} numberOfLines={4}>
              {item.title}
            </Text>
          </View>
        </TouchableDebounce>
      );
    },
    [colors.tertiary, mediaType, onItemPress, onRemovePress],
  );

  if (entries.length === 0) {
    return null;
  }

  const headerTitle = mediaType === 'audio' ? strings.continueListening : strings.continueWatching;

  return (
    <View style={styles.root}>
      <View style={[styles.separator, {backgroundColor: colors.listSeparator}]} />
      <View style={styles.header}>
        <Text type="primary" fontFamily="SourceSansPro-SemiBold" style={styles.headerTitle}>
          {headerTitle}
        </Text>
      </View>
      <FlatList
        ref={listRef}
        data={enrichedEntries}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.articleId)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ContinueRow;

const styles = StyleSheet.create({
  root: {
    marginBottom: 24,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    textTransform: 'uppercase',
  },
  listContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
  },
  imageContainer: {
    width: CARD_WIDTH,
    aspectRatio: 1.8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#888',
  },
  imageContainerAudio: {
    aspectRatio: 1,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
  removeButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarTrack: {
    position: 'absolute',
    left: 6,
    right: 6,
    bottom: 4,
    height: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#CCC',
  },
  progressBarFill: {
    height: '100%',
  },
  contentContainer: {
    paddingVertical: 8,
  },
  category: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
  },
});
