import {ScrollView} from 'react-native-gesture-handler';
import {HomeBlockVideoList} from '../../../../../../api/Types';
import {Article} from '../../../../../../../Types';
import {StyleSheet, View} from 'react-native';
import {buildArticleImageUri, buildImageUri, IMG_SIZE_XL} from '../../../../../../util/ImageUtil';
import {SectionHeader, TouchableDebounce} from '../../../../../../components';
import {useCallback} from 'react';
import TextComponent from '../../../../../../components/text/Text';
import {themeDark, themeLight, useTheme} from '../../../../../../Theme';
import LinearGradient from 'react-native-linear-gradient';
import {IconPlay} from '../../../../../../components/svg';
import ViewCount from '../../../../../../components/article/article/ViewCount';
import FastImage from '@d11/react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {useNavigationStore} from '../../../../../../state/navigation_store';

interface VideoListBlockProps {
  block: HomeBlockVideoList;
}

const VideoListBlock: React.FC<VideoListBlockProps> = ({block}) => {
  const {articles_list: articles} = block.data;
  const {category_id, category_title, slug_title} = block.data;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const onHeaderPressHandler = useCallback(() => {
    useNavigationStore.getState().openCategoryById(category_id, category_title);
  }, [category_id, category_title]);

  return (
    <View>
      <SectionHeader
        category={{
          name: category_title ?? slug_title ?? '',
          template_id: block.template_id,
          id: category_id,
        }}
        onPress={onHeaderPressHandler}
      />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap: 8, paddingHorizontal: 8, paddingVertical: 24}}>
        {articles.map((article, i) => (
          <TouchableDebounce
            key={article.id}
            onPress={() =>
              navigation.navigate('VideoList', {
                title: category_title ?? slug_title ?? '',
                articles: articles,
                initialIndex: i,
              })
            }>
            <VerticalVideoComponent article={article} />
          </TouchableDebounce>
        ))}
      </ScrollView>
    </View>
  );
};

const VerticalVideoComponent: React.FC<{article: Article}> = ({article}) => {
  const {colors} = useTheme();

  let imgUri;
  if (article.img_path_prefix && article.img_path_postfix) {
    imgUri = buildImageUri(IMG_SIZE_XL, article.img_path_prefix, article.img_path_postfix);
  } else if (article.photo) {
    imgUri = buildArticleImageUri(IMG_SIZE_XL, article.photo);
  }

  const mediaDuration = Boolean(article.media_duration) && (
    <TextComponent
      style={{...style.mediaDurationText, color: themeDark.colors.text}}
      importantForAccessibility="no">
      {article.media_duration}
    </TextComponent>
  );

  const playIcon = (
    <View
      style={{
        borderRadius: 4,
        backgroundColor: themeLight.colors.mediatekaPlayButton,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <IconPlay width={9} height={9} color={colors.onPrimary} />
    </View>
  );

  return (
    <View style={{borderRadius: 8, overflow: 'hidden'}}>
      <View style={{aspectRatio: 0.6, width: 176, justifyContent: 'flex-end'}}>
        <FastImage
          style={{...StyleSheet.absoluteFillObject}}
          source={{
            uri: imgUri,
          }}
          resizeMode={FastImage.resizeMode.stretch}
        />
        {mediaDuration}
        <ViewCount style={style.viewCount} article={article} visible={true} />
        <LinearGradient
          colors={['transparent', 'black']}
          locations={[0.3, 0.8]}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 200,
          }}
        />

        <TextComponent style={{color: 'white', paddingHorizontal: 8}} numberOfLines={3}>
          {article.title}
        </TextComponent>
        <View style={{height: 46, justifyContent: 'center', paddingHorizontal: 8}}>{playIcon}</View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  mediaDurationText: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 14,
  },
  viewCount: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default VideoListBlock;
