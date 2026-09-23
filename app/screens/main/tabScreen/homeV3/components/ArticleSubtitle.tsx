import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from '../../../../../components';
import {HomeV3Article} from '../../../../../api/Types';
import useHomeColors from './useHomeColors';

interface Props {
  article: HomeV3Article;
}

/** Red note under the title, e.g. "atnaujinta 09:39" for an updated article. */
const ArticleSubtitle: React.FC<Props> = ({article}) => {
  const colors = useHomeColors();

  if (!article.subtitle) {
    return null;
  }

  return (
    <Text style={{...styles.text, color: colors.subtitle}} fontFamily="SourceSansPro-SemiBold">
      {article.subtitle}
    </Text>
  );
};

export default ArticleSubtitle;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    lineHeight: 15,
  },
});
