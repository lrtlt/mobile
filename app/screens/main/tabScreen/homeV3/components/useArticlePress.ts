import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../../navigation/MainStack';
import {HomeV3Article} from '../../../../../api/Types';
import {pushArticle} from '../../../../../util/NavigationUtils';

const useArticlePress = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  return useCallback(
    (article: HomeV3Article) => {
      pushArticle(navigation, article);
    },
    [navigation],
  );
};

export default useArticlePress;
