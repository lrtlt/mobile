import React from 'react';
import DefaultHeader from './DefaultHeader';
import SlugHeader from './SlugHeader';
import { TouchableOpacity } from 'react-native-gesture-handler';

const sectionHeader = props => {
  const { category } = props;
  const { backgroundColor, name } = category;

  const header =
    category.is_slug_block && category.is_slug_block === 1 ? (
      <SlugHeader backgroundColor={backgroundColor} title={name} />
    ) : (
      <DefaultHeader backgroundColor={backgroundColor} title={name} />
    );

  return props.onPress ? (
    <TouchableOpacity onPress={() => props.onPress(category)}>{header}</TouchableOpacity>
  ) : (
    { header }
  );
};

export default React.memo(sectionHeader);
