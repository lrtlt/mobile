import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="-64 0 576 512" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M472 312.642v139c0 11.028-8.972 20-20 20H60c-11.028 0-20-8.972-20-20v-139H0v139c0 33.084 26.916 60 60 60h392c33.084 0 60-26.916 60-60v-139h-40z"
      />
      <Path
        fill={props.color}
        d="M256 .358L131.716 124.642 160 152.926l76-76v311.716h40V76.926l76 76 28.284-28.284z"
      />
    </Svg>
  );
}

export default SvgComponent;
