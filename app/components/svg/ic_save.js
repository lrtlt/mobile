import React from 'react';
import {IconBookmark, IconBookmarkFilled} from '.';

const SvgComponent = (props) => {
  if (props.filled) {
    return <IconBookmarkFilled size={props.size} color={props.color} />;
  } else {
    return <IconBookmark size={props.size} color={props.color} />;
  }
};

export default SvgComponent;
