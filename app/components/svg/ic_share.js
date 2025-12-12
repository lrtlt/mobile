import * as React from 'react';
import Svg, {Mask, Path, G} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
      fill={props.color}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Mask
        id="a"
        style={{
          maskType: 'alpha',
        }}
        maskUnits="userSpaceOnUse"
        width={props.size}
        height={props.size}>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 3.5a.5.5 0 01.788-.41l.066.056 4 4a.5.5 0 01.057.638l-.057.07-4 4a.5.5 0 01-.847-.268L9 11.5l-.001-2H7c-1.598 0-2.909.925-3 2.5v.5a.5.5 0 01-.992.09L3 12.5v-1c0-3.238 2.29-5.882 5.5-6h.499L9 3.5z"
        />
      </Mask>
      <G mask="url(#a)">
        <Path fill={props.color} d="M0 0H16V16H0z" />
      </G>
    </Svg>
  );
}

export default SvgComponent;
