import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, Dimensions} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {fetchArticle} from '../../api';
import {MainStackParamList} from '../../navigation/MainStack';
import {ArticleContent} from '../../api/Types';
import {replaceArticle} from '../../util/NavigationUtils';

type ArticleDeepLinkProxyRouteProp = RouteProp<MainStackParamList, 'ArticleProxy'>;
type ArticleDeepLinkProxyNavigationProp = StackNavigationProp<MainStackParamList, 'ArticleProxy'>;

const ArticleDeepLinkProxyScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const {colors} = useTheme();
  const navigation = useNavigation<ArticleDeepLinkProxyNavigationProp>();
  const route = useRoute<ArticleDeepLinkProxyRouteProp>();

  const {articleId} = route.params;

  useEffect(() => {
    if (!articleId) {
      setError('Nepavyko atidaryti straipsnio: trūksta ID');
      return;
    }

    const resolveArticleType = async (isMedia: boolean) => {
      try {
        const response = await fetchArticle(articleId, isMedia);
        const article: ArticleContent = response.article;

        replaceArticle(navigation, {
          id: articleId,
          is_audio: article.is_audio,
          is_video: article.is_video,
        });
      } catch (err) {
        if (!isMedia) {
          resolveArticleType(true); //Retry as media article if first attempt fails
          return;
        }
        console.error('Failed to resolve article type:', err);
        setError('Nepavyko atidaryti straipsnio. Bandykite dar kartą.');
      }
    };

    resolveArticleType(false);
  }, [articleId, navigation]);

  if (error) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={[styles.linkText, {color: colors.primary}]} onPress={() => navigation.goBack()}>
          Grįžti atgal
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Kraunama...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: Dimensions.get('window').height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArticleDeepLinkProxyScreen;
