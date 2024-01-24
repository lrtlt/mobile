import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {ArticleContentDefault} from '../../../api/Types';
import {Text, TouchableDebounce} from '../../../components';
import {MainStackParamList} from '../../../navigation/MainStack';
import {useTheme} from '../../../Theme';

interface Props {
  keywords?: ArticleContentDefault['article_keywords'];
}

const ArticleKeywords: React.FC<React.PropsWithChildren<Props>> = ({keywords}) => {
  const {colors} = useTheme();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Article'>>();

  const onKeywordClickHandler = useCallback(
    (name: string, slug: string) => {
      navigation.push('Slug', {name, slugUrl: slug});
    },
    [navigation],
  );

  return (
    <View style={styles.root}>
      {keywords?.map((k) => {
        return (
          <TouchableDebounce
            key={k.slug}
            style={{...styles.container, borderColor: colors.buttonBorder}}
            onPress={() => onKeywordClickHandler(k.name, k.slug)}>
            <Text type="secondary"># {k.name}</Text>
          </TouchableDebounce>
        );
      })}
    </View>
  );
};

export default ArticleKeywords;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    paddingVertical: 16,
  },
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    margin: 6,
    borderWidth: 1,
    borderRadius: 4,
  },
});
