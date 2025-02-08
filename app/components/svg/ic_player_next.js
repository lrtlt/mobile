import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 256 256" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M200 32a8 8 0 00-8 8v69.23L72.43 34.45A15.95 15.95 0 0048 47.88v160.24a16 16 0 0024.43 13.43L192 146.77V216a8 8 0 0016 0V40a8 8 0 00-8-8zM64 207.93V48.05l127.84 80z"
      />
    </Svg>
  );
}

export default SvgComponent;
