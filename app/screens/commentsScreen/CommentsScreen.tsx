import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FacebookComments} from '../../components';
import {MainStackParamList} from '../../navigation/MainStack';
import useNavigationAnalytics from '../../util/useNavigationAnalytics';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Comments'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Comments'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CommentsScreen: React.FC<React.PropsWithChildren<Props>> = ({route}) => {
  useNavigationAnalytics({
    viewId: 'Lrt app - Komentarai',
    title: 'Lrt app - Komentarai',
  });

  return (
    <View style={styles.container}>
      <FacebookComments url={route.params.url} />
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});
