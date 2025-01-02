import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Text from '../../../../../../components/text/Text';
import RadiotekaHorizontalList, {RadiotekaItem} from './RadiotekaHorizontalList';

type SelectionType = 'latest' | 'popular';

const LATEST_MOCK_DATA: RadiotekaItem[] = [
  {
    id: '1',
    category: 'Žinios',
    title: 'Žinios',
    subtitle: 'Nebeliko kliūčių pradėti gamyklos „Rheinmetall" statybas Baisogaloje',
    imageUrl: 'https://picsum.photos/300/300?random=1',
  },
  {
    id: '2',
    category: 'Laidos apie muziką',
    title: 'Garbanota banga',
    subtitle: '≈ 14 ≈',
    imageUrl: 'https://picsum.photos/300/300?random=2',
  },
  {
    id: '3',
    category: 'Aktualijos',
    title: 'Ryto garsai',
    subtitle: 'Pokalbis su ekonomikos ekspertu apie euro zonos perspektyvas',
    imageUrl: 'https://picsum.photos/300/300?random=3',
  },
  {
    id: '4',
    category: 'Kultūra',
    title: 'Kultūros savaitė',
    subtitle: 'Vilniaus knygų mugės apžvalga ir įspūdžiai',
    imageUrl: 'https://picsum.photos/300/300?random=4',
  },
  {
    id: '5',
    category: 'Sportas',
    title: 'Sporto pasaulis',
    subtitle: 'Lietuvos krepšinio rinktinės pasiruošimas olimpiadai',
    imageUrl: 'https://picsum.photos/300/300?random=5',
  },
  {
    id: '6',
    category: 'Mokslas',
    title: 'Mokslo sriuba',
    subtitle: 'Naujausi mokslo atradimai ir technologijos',
    imageUrl: 'https://picsum.photos/300/300?random=6',
  },
];

const POPULAR_MOCK_DATA = [
  {
    id: '7',
    category: 'Laidos',
    title: 'Savaitės pokalbis',
    subtitle: 'Interviu su Lietuvos kultūros premijos laureatu',
    imageUrl: 'https://picsum.photos/300/300?random=7',
  },
  {
    id: '8',
    category: 'Muzika',
    title: 'Muzikos valanda',
    subtitle: 'Klasikinės muzikos koncertų apžvalga',
    imageUrl: 'https://picsum.photos/300/300?random=8',
  },
  {
    id: '9',
    category: 'Dokumentika',
    title: 'Istorijos vingiai',
    subtitle: 'Dokumentinis pasakojimas apie Lietuvos partizanus',
    imageUrl: 'https://picsum.photos/300/300?random=9',
  },
  {
    id: '10',
    category: 'Politika',
    title: 'Politikos akiračiai',
    subtitle: 'Savaitės politinių įvykių analizė',
    imageUrl: 'https://picsum.photos/300/300?random=10',
  },
  {
    id: '11',
    category: 'Technologijos',
    title: 'Skaitmeninė era',
    subtitle: 'Dirbtinio intelekto vystymosi tendencijos',
    imageUrl: 'https://picsum.photos/300/300?random=11',
  },
  {
    id: '12',
    category: 'Sveikata',
    title: 'Sveikatos kodas',
    subtitle: 'Pokalbiai apie sveiką gyvenseną ir prevenciją',
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
      <RadiotekaHorizontalList data={selectedType === 'latest' ? LATEST_MOCK_DATA : POPULAR_MOCK_DATA} />
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
