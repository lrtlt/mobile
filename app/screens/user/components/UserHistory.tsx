import {PropsWithChildren, useCallback} from 'react';
import {Dimensions, Easing, StyleSheet, View} from 'react-native';
import {useTheme} from '../../../Theme';
import {IconHistory} from '../../../components/svg';
import {Text, TouchableDebounce} from '../../../components';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import HistoryArticleList from './HistoryArticleList';
import {useHistoryUserArticles} from '../../../api/hooks/useHistoryArticles';
import GradientShimmer from 'react-native-gradient-shimmer';
import LinearGradient from 'react-native-linear-gradient';

interface Props {}

const {width} = Dimensions.get('window');

const UserHistory: React.FC<PropsWithChildren<Props>> = () => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const {data, error} = useHistoryUserArticles(1, 6);
  const {colors} = useTheme();

  const onMorePress = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  if (error) {
    return null;
  }

  if (!data) {
    return (
      <GradientShimmer
        style={styles.shimmerContainer}
        LinearGradientComponent={LinearGradient}
        width={width - 24}
        height={176}
        highlightWidth={400}
        duration={1000}
        easing={Easing.circle}
      />
    );
  }

  return (
    <View style={[styles.container, {borderColor: colors.border}]}>
      <View style={[styles.headerContainer, {borderColor: colors.border}]}>
        <IconHistory size={32} color={colors.iconInactive} />
        <Text style={styles.headerText}>ISTORIJA</Text>
        <TouchableDebounce onPress={onMorePress}>
          <Text style={[styles.moreText, {color: colors.tertiary}]}>Daugiau</Text>
        </TouchableDebounce>
      </View>
      <HistoryArticleList articles={data?.items ?? []} />
    </View>
  );
};

export default UserHistory;

const styles = StyleSheet.create({
  shimmerContainer: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
  },

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
