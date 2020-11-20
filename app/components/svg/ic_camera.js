import React from 'react';
import Svg, {G, Rect, Path} from 'react-native-svg';

const SvgComponent = (props) => (
  <Svg
    {...props}
    className="svg-icon svg-icon-camera"
    width={props.size}
    height={props.size}
    viewBox="0 0 19 12">
    <G stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <G transform="translate(-80.000000, -6313.000000)" fillRule="nonzero">
        <G transform="translate(0.000000, 5840.000000)">
          <G transform="translate(80.000000, 115.000000)">
            <G transform="translate(0.000000, 358.000000)">
              <Rect fill="#93BDE7" x={0} y={0} width={14} height={12} rx={1} />
              <Path
                fill="#BADAFB"
                d="M8.10769231,5.53846154 L18.3076923,1.28846154 C18.562593,1.18225293 18.8553299,1.30279165 18.9615385,1.55769231 C18.9869281,1.61862739 19,1.68398699 19,1.75 L19,10.25 C19,10.5261424 18.7761424,10.75 18.5,10.75 C18.433987,10.75 18.3686274,10.7369281 18.3076923,10.7115385 L8.10769231,6.46153846 C7.85279165,6.35532986 7.73225293,6.06259296 7.83846154,5.80769231 C7.88918595,5.68595373 7.98595373,5.58918595 8.10769231,5.53846154 Z"
              />
            </G>
          </G>
        </G>
      </G>
    </G>
  </Svg>
);

export default SvgComponent;
