import React from 'react';
import DefaultHeader from './DefaultHeader';
import SlugHeader from './SlugHeader';
import {TouchableOpacity} from 'react-native-gesture-handler';

const SectionHeader = (props) => {
  const {category, onPress} = props;
  const {name} = category;

  const header =
    category.is_slug_block && category.is_slug_block === 1 ? (
      <SlugHeader title={name} />
    ) : (
      <DefaultHeader title={name} />
    );

  return props.onPress ? <TouchableOpacity onPress={onPress}>{header}</TouchableOpacity> : {header};
};

export default SectionHeader;
