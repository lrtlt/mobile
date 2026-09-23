import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Text, TouchableDebounce} from '../../../../../components';
import {MainStackParamList} from '../../../../../navigation/MainStack';
import useHomeColors from './useHomeColors';

interface Props {
  keyword: {slug: string; slug_title: string};
}

/** "# Rinkimai Rusijoje" tag under a featured article. Opens the tag page. */
const KeywordTag: React.FC<Props> = ({keyword}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const colors = useHomeColors();

  const onPress = useCallback(() => {
    navigation.navigate('Slug', {name: keyword.slug_title, slugUrl: `/tema/${keyword.slug}`});
  }, [keyword, navigation]);

  return (
    <TouchableDebounce
      style={{...styles.container, borderColor: colors.tagBorder}}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={keyword.slug_title}>
      <Text style={styles.text} numberOfLines={1}>
        <Text style={{...styles.text, color: colors.tagHash}}>{'# '}</Text>
        <Text style={{...styles.text, color: colors.description}}>{keyword.slug_title}</Text>
      </Text>
    </TouchableDebounce>
  );
};

export default KeywordTag;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
  },
});
