import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 16 16" {...props}>
      <Path
        d="M2 4a1 1 0 011 1v6a1 1 0 01-2 0V5a1 1 0 011-1zm12 1a1 1 0 011 1v4a1 1 0 01-2 0V6a1 1 0 011-1zM5 5a1 1 0 011 1v4a1 1 0 01-2 0V6a1 1 0 011-1zm3-1a1 1 0 011 1v6a1 1 0 01-2 0V5a1 1 0 011-1zm3-2a1 1 0 011 1v10a1 1 0 01-2 0V3a1 1 0 011-1z"
        fill={props.color}
        fillRule="nonzero"
      />
    </Svg>
  );
}

export default SvgComponent;
