import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 512 512" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        stroke={props.color}
        strokeWidth={8}
        d="M511.824 255.863L278.488 0v153.266h-27.105c-67.145 0-130.274 26.148-177.754 73.629C26.149 274.375 0 337.504 0 404.652V512l44.781-49.066c59.903-65.63 144.934-103.594 233.707-104.457V511.73zM30.004 434.867v-30.215c0-59.132 23.027-114.73 64.84-156.543s97.406-64.84 156.539-64.84h57.105V77.427l162.735 178.437-162.735 178.442V328.46H281.57c-94.703 0-185.773 38.652-251.566 106.406zm0 0"
      />
    </Svg>
  );
}

export default SvgComponent;
