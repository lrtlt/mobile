import React from 'react';
import {View, StyleSheet} from 'react-native';
import HTMLRenderer from '../../htmlRenderer/HTMLRenderer';

interface Props {
  htmlText?: string;
}

const ArticleParagraph: React.FC<Props> = ({htmlText = ''}) => {
  return (
    <View style={styles.container}>
      <HTMLRenderer html={htmlText} />
    </View>
  );
};

export default ArticleParagraph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
  },
});
