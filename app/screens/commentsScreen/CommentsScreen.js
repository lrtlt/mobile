import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FacebookComments} from '../../components';

const CommentsScreen = (props) => {
  const {route} = props;
  const url = route.params.url;

  return (
    <View style={styles.container}>
      <FacebookComments url={url} />
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
