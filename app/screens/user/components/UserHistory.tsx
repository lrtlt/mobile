import {PropsWithChildren, useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../../Theme';
import {IconHistory} from '../../../components/svg';
import {ArticleRow, Text, TouchableDebounce} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import useUserArticleHistory from './useUserArticleHistory';
import HistoryArticleList from './HistoryArticleList';

interface Props {}

const UserHistory: React.FC<PropsWithChildren<Props>> = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const {articles} = useUserArticleHistory();

  const {colors} = useTheme();

  const onMorePress = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  return (
    <View style={[styles.container, {borderColor: colors.border}]}>
      <View style={[styles.headerContainer, {borderColor: colors.border}]}>
        <IconHistory size={32} color={colors.text} />
        <Text style={styles.headerText}>Paskutiniai atidaryti</Text>
        <TouchableDebounce onPress={onMorePress}>
          <Text style={[styles.moreText, {color: colors.tertiary}]}>Daugiau</Text>
        </TouchableDebounce>
      </View>
      <HistoryArticleList articles={articles} />
    </View>
  );
};

export default UserHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
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
