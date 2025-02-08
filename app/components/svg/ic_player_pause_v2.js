import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg fill="currentColor" viewBox="0 0 256 256" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M216 48v160a16 16 0 01-16 16h-40a16 16 0 01-16-16V48a16 16 0 0116-16h40a16 16 0 0116 16zM96 32H56a16 16 0 00-16 16v160a16 16 0 0016 16h40a16 16 0 0016-16V48a16 16 0 00-16-16z"
      />
    </Svg>
  );
}

export default SvgComponent;
