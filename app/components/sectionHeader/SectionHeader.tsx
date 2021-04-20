import React from 'react';
import DefaultHeader from './DefaultHeader';
import SlugHeader from './SlugHeader';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Category} from '../../redux/reducers/articles';

interface Props {
  category: Category;
  onPress?: () => void;
}
const SectionHeader: React.FC<Props> = ({category, onPress}) => {
  const header =
    category.is_slug_block && category.is_slug_block === 1 ? (
      <SlugHeader title={category.name} />
    ) : (
      <DefaultHeader title={category.name} />
    );

  return onPress ? <TouchableOpacity onPress={onPress}>{header}</TouchableOpacity> : header;
};

export default SectionHeader;
