import React from 'react';
import {View, StyleSheet} from 'react-native';
import HTMLRenderer from '../../htmlRenderer/HTMLRenderer';

interface Props {
  htmlText?: string;
  textSize?: number;
}

const ArticleParagraph: React.FC<React.PropsWithChildren<Props>> = ({htmlText = '', textSize}) => {
  return (
    <View style={styles.container}>
      <HTMLRenderer html={htmlText} textSize={textSize} />
    </View>
  );
};

export default ArticleParagraph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
