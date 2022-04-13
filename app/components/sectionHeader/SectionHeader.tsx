import React from 'react';
import DefaultHeader from './DefaultHeader';
import SlugHeader from './SlugHeader';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Category} from '../../redux/reducers/articles';

interface Props {
  category: Category;
  color?: string;
  onPress?: () => void;
}
const SectionHeader: React.FC<Props> = ({category, color, onPress}) => {
  const header =
    category.is_slug_block === 1 ? (
      <SlugHeader title={category.name} color={color} />
    ) : (
      <DefaultHeader title={category.name} />
    );

  return onPress ? <TouchableOpacity onPress={onPress}>{header}</TouchableOpacity> : header;
};

export default SectionHeader;
