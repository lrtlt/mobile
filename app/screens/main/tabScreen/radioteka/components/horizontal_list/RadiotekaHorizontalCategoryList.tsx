import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../../../../../components/text/Text';
import RadiotekaHorizontalList, {RadiotekaItem} from './RadiotekaHorizontalList';

interface RadiotekaHorizontalCategoryListProps {
  categoryTitle: string;
  categorySubtitle: string;
  data?: RadiotekaItem[];
  variation?: 'full' | 'minimal';
  onItemPress?: (item: RadiotekaItem) => void;
}

const MOCK_DATA: RadiotekaItem[] = [
  {
    id: '1',
    category: 'Gyvenimo būdas',
    title: 'Sugyvenimai',
    imageUrl: 'https://picsum.photos/300/300?random=9',
  },
  {
    id: '2',
    category: 'Gyvenimo būdas',
    title: 'Žaidžiam žmogų',
    imageUrl: 'https://picsum.photos/300/300?random=8',
  },
  {
    id: '3',
    category: 'Test',
    title: 'Test',
    imageUrl: 'https://picsum.photos/300/300?random=5',
  },
];

const RadiotekaHorizontalCategoryList: React.FC<RadiotekaHorizontalCategoryListProps> = ({
  categoryTitle = 'GYVENIMO BŪDAS',
  categorySubtitle = '#Gyvenimas',
  data = MOCK_DATA,
  onItemPress,
  variation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text type="primary" fontFamily="SourceSansPro-SemiBold" style={styles.title}>
          {categoryTitle}
        </Text>
        <Text type="secondary" fontFamily="SourceSansPro-Regular" style={styles.subtitle}>
          {categorySubtitle}
        </Text>
      </View>
      <RadiotekaHorizontalList data={data} onItemPress={onItemPress} variation={variation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
});

export default RadiotekaHorizontalCategoryList;
