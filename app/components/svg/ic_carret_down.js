import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 -256 1792 1792" width={props.size} height={props.size}>
      <Path
        d="M1426.44 407.864q0 26-19 45l-448 448q-19 19-45 19t-45-19l-448-448q-19-19-19-45t19-45q19-19 45-19h896q26 0 45 19t19 45z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;
