import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 256 256" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M164.24 100.24L136.48 128l27.76 27.76a6 6 0 11-8.48 8.48L128 136.48l-27.76 27.76a6 6 0 01-8.48-8.48L119.52 128l-27.76-27.76a6 6 0 018.48-8.48L128 119.52l27.76-27.76a6 6 0 018.48 8.48zM230 128A102 102 0 11128 26a102.12 102.12 0 01102 102zm-12 0a90 90 0 10-90 90 90.1 90.1 0 0090-90z"
      />
    </Svg>
  );
}

export default SvgComponent;
