import React from 'react';
import {View, StyleSheet} from 'react-native';
import RadiotekaHero from './components/hero/RadiotekaHero';
import RadiotekaHorizontalSelectableList from './components/horizontal_list/RadiotekaHorizontalSelectableList';
import RadiotekaHorizontalCategoryList from './components/horizontal_list/RadiotekaHorizontalCategoryList';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../../../Theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RadiotekaHeroCarousel} from './components/hero/RadiotekaHeroCarousel';
import {MOCK_CAROUSEL_ITEMS} from './components/hero/mockData';

const RadiotekaScreen: React.FC = () => {
  const theme = useTheme();
  const {bottom} = useSafeAreaInsets();
  return (
    <View style={{...styles.container, backgroundColor: theme.colors.background}}>
      <ScrollView contentContainerStyle={{paddingBottom: bottom}}>
        <RadiotekaHero />
        <RadiotekaHorizontalSelectableList />
        <RadiotekaHorizontalCategoryList
          categoryTitle="AKTUALIJOS"
          categorySubtitle="#Žinios"
          variation="minimal"
        />
        <RadiotekaHorizontalCategoryList categoryTitle="GYVENIMO BŪDAS" categorySubtitle="#Gyvenimas" />
        <RadiotekaHeroCarousel items={MOCK_CAROUSEL_ITEMS} />
        <RadiotekaHorizontalCategoryList
          categoryTitle="AKTUALIJOS"
          categorySubtitle="#Žinios"
          variation="minimal"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RadiotekaScreen;
