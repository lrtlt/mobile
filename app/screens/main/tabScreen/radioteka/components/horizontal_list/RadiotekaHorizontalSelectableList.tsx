import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../../../../../../components/text/Text';
import RadiotekaHorizontalList from './RadiotekaHorizontalList';

type SelectionType = 'latest' | 'popular';

const LATEST_MOCK_DATA = [
  {
    id: '1',
    category: 'Žinios',
    title: 'Žinios',
    imageUrl: 'https://picsum.photos/300/300?random=1',
  },
  {
    id: '2',
    category: 'Laidos apie muziką',
    title: 'Garbanota banga',
    imageUrl: 'https://picsum.photos/300/300?random=2',
  },
  {
    id: '3',
    category: 'Aktualijos',
    title: 'Ryto garsai',
    imageUrl: 'https://picsum.photos/300/300?random=3',
  },
  {
    id: '4',
    category: 'Kultūra',
    title: 'Kultūros savaitė',
    imageUrl: 'https://picsum.photos/300/300?random=4',
  },
  {
    id: '5',
    category: 'Sportas',
    title: 'Sporto pasaulis',
    imageUrl: 'https://picsum.photos/300/300?random=5',
  },
  {
    id: '6',
    category: 'Mokslas',
    title: 'Mokslo sriuba',
    imageUrl: 'https://picsum.photos/300/300?random=6',
  },
];

const POPULAR_MOCK_DATA = [
  {
    id: '7',
    category: 'Laidos',
    title: 'Savaitės pokalbis',
    imageUrl: 'https://picsum.photos/300/300?random=7',
  },
  {
    id: '8',
    category: 'Muzika',
    title: 'Muzikos valanda',
    imageUrl: 'https://picsum.photos/300/300?random=8',
  },
  {
    id: '9',
    category: 'Dokumentika',
    title: 'Istorijos vingiai',
    imageUrl: 'https://picsum.photos/300/300?random=9',
  },
  {
    id: '10',
    category: 'Politika',
    title: 'Politikos akiračiai',
    imageUrl: 'https://picsum.photos/300/300?random=10',
  },
  {
    id: '11',
    category: 'Technologijos',
    title: 'Skaitmeninė era',
    imageUrl: 'https://picsum.photos/300/300?random=11',
  },
  {
    id: '12',
    category: 'Sveikata',
    title: 'Sveikatos kodas',
    imageUrl: 'https://picsum.photos/300/300?random=12',
  },
];

const RadiotekaHorizontalSelectableList: React.FC = () => {
  const [selectedType, setSelectedType] = useState<SelectionType>('latest');

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, selectedType === 'latest' && styles.selectedButton]}
          onPress={() => setSelectedType('latest')}>
          <Text
            type={selectedType === 'latest' ? 'primary' : 'secondary'}
            fontFamily="SourceSansPro-Regular"
            style={styles.buttonText}>
            Naujausi
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedType === 'popular' && styles.selectedButton]}
          onPress={() => setSelectedType('popular')}>
          <Text
            type={selectedType === 'popular' ? 'primary' : 'secondary'}
            fontFamily="SourceSansPro-Regular"
            style={styles.buttonText}>
            Populiariausi
          </Text>
        </TouchableOpacity>
      </View>
      <RadiotekaHorizontalList items={selectedType === 'latest' ? LATEST_MOCK_DATA : POPULAR_MOCK_DATA} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#F5F5F5',
  },
  buttonText: {
    fontSize: 14,
  },
});

export default RadiotekaHorizontalSelectableList;
