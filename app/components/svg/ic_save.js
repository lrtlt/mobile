import React from 'react';
import IconBookmark from './ic_bookmark';
import IconBookmarkFilled from './ic_bookmark_filled';

const SvgComponent = (props) => {
  if (props.filled) {
    return <IconBookmarkFilled size={props.size} color={props.color} />;
  } else {
    return <IconBookmark size={props.size} color={props.color} />;
  }
};

export default SvgComponent;
