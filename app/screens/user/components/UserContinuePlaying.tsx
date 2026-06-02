import {PropsWithChildren, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../Theme';
import {IconPlayCircle} from '../../../components/svg';
import {Text, TouchableDebounce} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import HistoryArticleList from './HistoryArticleList';
import {useContinuePlayingArticles} from '../../../api/hooks/useContinuePlayingArticles';

interface Props {}

const ITEM_COUNT = 6;

const UserContinuePlaying: React.FC<PropsWithChildren<Props>> = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {colors, strings} = useTheme();

  const {articles, error} = useContinuePlayingArticles(ITEM_COUNT);

  const onMorePress = useCallback(() => {
    navigation.navigate('ContinuePlaying');
  }, [navigation]);

  if (error || articles.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, {borderColor: colors.border}]}>
      <View style={[styles.headerContainer, {borderColor: colors.border}]}>
        <IconPlayCircle size={32} color={colors.iconInactive} />
        <Text style={styles.headerText}>{strings.continuePlaying}</Text>
        <TouchableDebounce onPress={onMorePress}>
          <Text style={[styles.moreText, {color: colors.tertiary}]}>{strings.moreButtonText}</Text>
        </TouchableDebounce>
      </View>
      <HistoryArticleList articles={articles} />
    </View>
  );
};

export default UserContinuePlaying;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 24,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    flex: 1,
  },
  moreText: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
});
