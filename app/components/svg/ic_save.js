import React from 'react';
import IconBookmark from './ic_bookmark';
import IconBookmarkFilled from './ic_bookmark_filled';
import {IconBookmarkNew, IconHeart, IconHeartFilled} from '.';
import {useTheme} from '../../Theme';

const SvgComponent = (props) => {
  const {colors} = useTheme();

  if (props.filled) {
    return <IconBookmarkNew size={props.size} color={colors.iconActive} />;
  } else {
    return <IconBookmarkNew size={props.size} color={colors.iconInactive} />;
  }
};

export default SvgComponent;
