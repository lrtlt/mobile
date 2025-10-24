import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Article} from '../../../../../../../Types';
import {HomeBlockSlug} from '../../../../../../api/Types';
import {ArticleRow, MoreArticlesButton, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {themeDark, themeLight, useTheme} from '../../../../../../Theme';
import {formatArticles} from '../../../../../../util/articleFormatters';
import {buildArticleImageUri, IMG_SIZE_L} from '../../../../../../util/ImageUtil';
import FastImage from '@d11/react-native-fast-image';
import ThemeProvider from '../../../../../../theme/ThemeProvider';
import {pushArticle} from '../../../../../../util/NavigationUtils';

interface SlugArticlesBlockProps {
  block: HomeBlockSlug;
}

const defaultBackgroundImage = require('../../../../../../../assets/img/tag-bg-lrt-default.jpg');

const SlugArticlesBlock: React.FC<SlugArticlesBlockProps> = ({block}) => {
  const {data, template_id} = block;
  const {articles_list, slug_title, slug_url} = data;

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const theme = useTheme();

  const formattedArticles = useMemo(
    () => formatArticles(template_id, articles_list),
    [articles_list, template_id],
  );

  const articlePressHandler = useCallback(
    (article: Article) => {
      pushArticle(navigation, article);
    },
    [navigation],
  );

  const onHeaderPressHandler = useCallback(() => {
    navigation.navigate('Slug', {
      name: slug_title,
      slugUrl: slug_url,
    });
  }, [navigation, slug_title, slug_url]);

  const articleList = useMemo(
    () =>
      formattedArticles.map((row, index) => (
        <ArticleRow
          key={index}
          articleStyle={
            template_id === 9 ? {...styles.article, backgroundColor: themeLight.colors.background} : undefined
          }
          data={row}
          onArticlePress={articlePressHandler}
        />
      )),
    [articlePressHandler, formattedArticles, template_id],
  );

  return (
    <View style={styles.root}>
      <View>
        {template_id === 9 ? (
          <FastImage
            style={StyleSheet.absoluteFillObject}
            source={
              block.background_image
                ? {uri: buildArticleImageUri(IMG_SIZE_L, block.background_image)}
                : defaultBackgroundImage
            }
            resizeMode={FastImage.resizeMode.cover}
          />
        ) : null}
        <>
          {template_id === 9 && (
            <LinearGradient
              style={StyleSheet.absoluteFillObject}
              colors={['#000000EE', '#00000099', '#00000050']}
              useAngle={true}
              angle={0}
            />
          )}
          <SectionHeader
            category={{name: slug_title, template_id: template_id, is_slug_block: 1, slug_url: slug_url}}
            onPress={onHeaderPressHandler}
            color={template_id === 9 ? themeDark.colors.text : undefined}
          />
          <ThemeProvider forceTheme={template_id === 9 ? themeLight : theme}>{articleList}</ThemeProvider>
        </>
      </View>
      <MoreArticlesButton onPress={onHeaderPressHandler} />
    </View>
  );
};

export default SlugArticlesBlock;

const styles = StyleSheet.create({
  root: {
    marginBottom: 12,
  },
  article: {
    borderRadius: 4,
    margin: 12,
  },
});
