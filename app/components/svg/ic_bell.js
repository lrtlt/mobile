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
      <G clipPath="url(#clip0_3381_9897)">
        <Path
          d="M20.999 28a1 1 0 01-1 1h-8a1 1 0 010-2h8a1 1 0 011 1zm6.726-6.008c-.695-1.195-1.726-4.576-1.726-8.992a10 10 0 00-20 0c0 4.418-1.033 7.797-1.727 8.992A2 2 0 006 25h20a2 2 0 001.725-3.008z"
          fill={props.color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3381_9897">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
