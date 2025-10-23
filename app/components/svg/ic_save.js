import React from 'react';
import IconBookmark from './ic_bookmark';
import IconBookmarkFilled from './ic_bookmark_filled';
import {IconHeart, IconHeartFilled} from '.';

const SvgComponent = (props) => {
  if (props.filled) {
    return <IconHeartFilled size={props.size} color={props.color} />;
  } else {
    return <IconHeart size={props.size} color={props.color} />;
  }
};

export default SvgComponent;
