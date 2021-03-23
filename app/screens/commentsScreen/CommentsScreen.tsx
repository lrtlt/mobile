import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FacebookComments} from '../../components';
import {MainStackParamList} from '../../navigation/MainStack';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Comments'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Comments'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

const CommentsScreen: React.FC<Props> = ({route}) => {
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
    overflow: 'hidden',
  },
});
