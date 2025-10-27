import React, {useEffect, useMemo} from 'react';
import {View, Button, ActivityIndicator, StyleSheet} from 'react-native';
import {ArticleRow, MyFlatList, Text} from '../../components';
import {formatArticles} from '../../util/articleFormatters';
import {ARTICLES_PER_PAGE_COUNT} from '../../constants';
import {useTheme} from '../../Theme';
import {MainStackParamList} from '../../navigation/MainStack';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';
import {pushArticle} from '../../util/NavigationUtils';
import {useArticlesByTag} from '../../api/hooks/useArticlesByTag';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Slug'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Slug'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const SlugScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const {name, slugUrl} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, []);

  const {colors, strings} = useTheme();

  const segments = slugUrl?.split('/');
  const tag = segments ? segments[segments.length - 1] : '';
  const {data, error, isLoading, refetch} = useArticlesByTag(tag, ARTICLES_PER_PAGE_COUNT * 6);

  const formattedArticles = useMemo(() => {
    return formatArticles(-1, data?.articles || [], false);
  }, [data]);

  useNavigationAnalytics({
    viewId: `https://www.lrt.lt/${slugUrl}`,
    title: name,
    sections: ['slug'],
  });

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'small'} animating={isLoading} />
      </View>
    );
  };

  const renderError = () => {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText} type="error">
          {strings.error_no_connection}
        </Text>
        <Button title={strings.tryAgain} color={colors.primary} onPress={() => refetch()} />
      </View>
    );
  };

  let content;
  if (error || !tag) {
    content = renderError();
  } else if (isLoading) {
    content = renderLoading();
  } else {
    content = (
      <MyFlatList
        showsVerticalScrollIndicator={false}
        data={formattedArticles}
        windowSize={4}
        renderItem={(item) => {
          return (
            <ArticleRow
              data={item.item}
              onArticlePress={(article) => {
                pushArticle(navigation, article);
              }}
            />
          );
        }}
        removeClippedSubviews={false}
        keyExtractor={(item, index) => String(index) + String(item)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.container}>{content}</View>
    </View>
  );
};

export default SlugScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginBottom: 20,
    fontSize: 20,
  },
});
