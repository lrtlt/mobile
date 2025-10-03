import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="-2 -2 16 16"
      fill="none"
      {...props}>
      <Path
        d="M4.119 4.119h3.762m-3.762 0v3.762m0-3.762V.824A.324.324 0 003.795.5H.825A.324.324 0 00.5.824v2.97c0 .18.145.325.324.325H4.12zm3.762 0v3.762m0-3.762h3.295a.324.324 0 00.324-.324V.825A.324.324 0 0011.176.5h-2.97a.324.324 0 00-.325.324V4.12zm0 3.762H4.119m3.762 0h3.295c.179 0 .324.145.324.324v2.97a.324.324 0 01-.324.325h-2.97a.324.324 0 01-.325-.324V7.88zm-3.762 0H.824a.324.324 0 00-.324.324v2.97c0 .18.145.325.324.325h2.97a.324.324 0 00.325-.324V7.88z"
        stroke={props.color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default SvgComponent;
