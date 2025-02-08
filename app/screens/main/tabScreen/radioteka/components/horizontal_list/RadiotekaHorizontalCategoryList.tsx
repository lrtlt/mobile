import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../../../../../components/text/Text';
import RadiotekaHorizontalList, {RadiotekaListItem} from './RadiotekaHorizontalList';
import {Keyword} from '../../../../../../api/Types';
import {TouchableDebounce} from '../../../../../../components';
import {useTheme} from '../../../../../../Theme';

interface RadiotekaHorizontalCategoryListProps {
  categoryTitle: string;
  keywords?: Keyword[];
  variation?: 'full' | 'minimal';
  items: RadiotekaListItem[];
  onItemPress?: (index: number) => void;
  onItemPlayPress?: (index: number) => void;
  onKeywordPress?: (keyword: Keyword) => void;
}

const RadiotekaHorizontalCategoryList: React.FC<RadiotekaHorizontalCategoryListProps> = ({
  categoryTitle,
  keywords,
  items,
  onItemPress,
  onItemPlayPress,
  onKeywordPress,
  variation,
}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <View style={{height: StyleSheet.hairlineWidth, backgroundColor: colors.listSeparator}} />
      <View style={styles.header}>
        <Text type="primary" fontFamily="SourceSansPro-SemiBold" style={styles.title}>
          {categoryTitle}
        </Text>
        {keywords && (
          <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
            {keywords.map((k) => (
              <TouchableDebounce key={k.slug} onPress={() => onKeywordPress?.(k)}>
                <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.subtitle}>
                  #{k.name}
                </Text>
              </TouchableDebounce>
            ))}
          </View>
        )}
      </View>
      <RadiotekaHorizontalList
        items={items}
        onItemPress={onItemPress}
        onItemPlayPress={onItemPlayPress}
        variation={variation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.8,
  },
});

export default RadiotekaHorizontalCategoryList;
