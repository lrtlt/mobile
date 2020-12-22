import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg height={props.size} viewBox="0 0 512 512" width={props.size} {...props}>
      <Path d="M512 31.893H256L235.984 179.48 512 159.464z" fill="#b4d2d7" />
      <Path d="M0 31.893v127.571l256 20.016V31.893z" fill="#e1ebf0" />
      <Path d="M47.839 80.678h31.893v30H47.839z" fill="#ff4a4a" />
      <Path d="M111.625 80.678h31.893v30h-31.893z" fill="#ffd422" />
      <Path d="M175.41 80.678h31.893v30H175.41z" fill="#90e36a" />
      <Path d="M512 159.464H256l-20.016 160.322L256 480.107h256z" fill="#03232e" />
      <Path d="M0 159.464h256v320.644H0z" fill="#07485e" />
      <Path d="M256 270.054h16.893v99.463H256zM239.107 270.054H256v99.463h-16.893z" fill="none" />
      <Path d="M145.322 304.786h-33.785v-64.732h-30v94.732h63.785v64.731h30V240.054h-30z" fill="#fff5f5" />
      <Path
        d="M400.463 240.054v64.732h-33.785v-64.732h-30v94.732h63.785v64.731h30V240.054zM272.893 270.054v99.463H256l-10.008 15.15L256 399.517h46.893V240.054H256L245.992 256 256 270.054z"
        fill="#e1ebf0"
      />
      <Path d="M209.107 399.517H256v-30h-16.893v-99.463H256v-30h-46.893z" fill="#fff5f5" />
    </Svg>
  );
}

export default SvgComponent;
