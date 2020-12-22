import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 512 512" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M128 230.4h51.2v51.2H128zM230.4 230.4h51.2v51.2h-51.2zM332.8 230.4H384v51.2h-51.2zM128 332.8h51.2V384H128zM230.4 332.8h51.2V384h-51.2zM332.8 332.8H384V384h-51.2z"
      />
      <Path
        fill={props.color}
        d="M486.4 51.2h-51.2V25.6c0-15.36-10.24-25.6-25.6-25.6C394.24 0 384 10.24 384 25.6v25.6H128V25.6C128 10.24 117.76 0 102.4 0 87.04 0 76.8 10.24 76.8 25.6v25.6H25.6C10.24 51.2 0 61.44 0 76.8v409.6C0 501.76 10.24 512 25.6 512h460.8c12.8 0 25.6-10.24 25.6-25.6V76.8c0-15.36-12.8-25.6-25.6-25.6zm-25.6 409.6H51.2V153.6h409.6v307.2z"
      />
    </Svg>
  );
}

export default SvgComponent;
