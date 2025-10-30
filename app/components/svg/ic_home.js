import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 19 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M18.125 14.375h-1.25V8.75l.183.183a.626.626 0 00.884-.886L10.26.366a1.25 1.25 0 00-1.768 0L.808 8.047a.625.625 0 10.884.884l.183-.18v5.624H.625a.625.625 0 100 1.25h17.5a.624.624 0 100-1.25zm-6.875 0H7.5v-3.75a.313.313 0 01.313-.312h3.125a.313.313 0 01.312.312v3.75z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;
