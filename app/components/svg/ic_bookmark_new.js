import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_3381_6838)">
        <Path
          d="M23 4H9a2 2 0 00-2 2v22a1 1 0 001.53.848l7.47-4.67 7.471 4.67A.999.999 0 0025 28V6a2 2 0 00-2-2z"
          fill={props.color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3381_6838">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
