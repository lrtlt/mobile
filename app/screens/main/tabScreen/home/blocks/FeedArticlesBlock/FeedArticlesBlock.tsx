import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Article} from '../../../../../../../Types';
import {HomeBlockFeedBlock} from '../../../../../../api/Types';
import {ArticleFeedItem, MoreArticlesButton, SectionHeader} from '../../../../../../components';
import {MainStackParamList} from '../../../../../../navigation/MainStack';
import {openCategoryForName} from '../../../../../../redux/actions/navigation';
import {useTheme} from '../../../../../../Theme';

interface FeedArticlesBlockProps {
  block: HomeBlockFeedBlock;
}

const FeedArticlesBlock: React.FC<FeedArticlesBlockProps> = ({block}) => {
  const {articles_list, block_title, template_id} = block;
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch();

  const {colors} = useTheme();

  const articlePressHandler = useCallback(
    (article: Article) => {
      navigation.navigate('Article', {articleId: article.id});
    },
    [navigation],
  );

  const onHeaderPressHandler = useCallback(() => {
    dispatch(openCategoryForName('Naujausi'));
  }, [dispatch]);

  const articleList = useMemo(
    () =>
      articles_list.map((article, index) => (
        <ArticleFeedItem key={index} article={article} onPress={articlePressHandler} />
      )),
    [articlePressHandler, articles_list],
  );

  return (
    <View>
      <SectionHeader
        category={{name: block_title, template_id: template_id}}
        onPress={onHeaderPressHandler}
      />
      {articleList}
      <MoreArticlesButton onPress={onHeaderPressHandler} backgroundColor={colors.slugBackground} />
    </View>
  );
};

export default FeedArticlesBlock;
