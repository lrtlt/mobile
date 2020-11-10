import React from 'react';
import {View} from 'react-native';
import Styles from './styles';
import {FacebookComments} from '../../components';
import EStyleSheet from 'react-native-extended-stylesheet';

const CommentsScreen = (props) => {
  const {route} = props;
  const url = route.params.url;

  return (
    <View style={[Styles.flex, {backgroundColor: EStyleSheet.value('$white')}]}>
      <FacebookComments url={url} />
    </View>
  );
};

export default CommentsScreen;
