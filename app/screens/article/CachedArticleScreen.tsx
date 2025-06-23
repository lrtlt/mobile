import React, {useCallback} from 'react';
import ArticleContentComponent, {ArticleSelectableItem} from './ArticleContentComponent';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import Snackbar from '../../components/snackbar/SnackBar';
import {themeLight, useTheme} from '../../Theme';

type ScreenRouteProp = RouteProp<MainStackParamList, 'CachedArticle'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'CachedArticle'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CachedArticleScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation, route}) => {
  const [snackbar, setSnackbar] = React.useState<React.ReactElement | null>(null);

  const {article} = route.params;
  const {strings} = useTheme();

  const showSnackBar = useCallback((message: string) => {
    setSnackbar(
      <Snackbar
        message={message}
        duration={2000}
        backgroundColor={themeLight.colors.primaryDark}
        onDismiss={() => setSnackbar(null)}
      />,
    );
  }, []);

  const articleItemPressHandler = useCallback(
    (item: ArticleSelectableItem) => {
      switch (item.type) {
        case 'photo': {
          showSnackBar(strings.error_no_connection);
          break;
        }
        case 'article': {
          showSnackBar(strings.error_no_connection);
          break;
        }
        default: {
          console.warn('Unkown type selected ' + item.type);
          break;
        }
      }
    },
    [article, navigation, showSnackBar],
  );

  return (
    <>
      <ArticleContentComponent article={article} itemPressHandler={articleItemPressHandler} />
      {snackbar}
    </>
  );
};

export default CachedArticleScreen;
