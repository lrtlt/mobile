import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 163.861 163.861" {...props}>
      <Path
        fill={props.color}
        d="M34.857 3.613C20.084-4.861 8.107 2.081 8.107 19.106v125.637c0 17.042 11.977 23.975 26.75 15.509L144.67 97.275c14.778-8.477 14.778-22.211 0-30.686L34.857 3.613z"
      />
    </Svg>
  );
}

export default SvgComponent;
