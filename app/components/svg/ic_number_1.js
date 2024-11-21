import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={48} height={64} viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.36 9.383V47.48c0 2.202.42 3.09.675 3.366.37.33 1.237.714 3.085.714h2v5.783l-2.1-.105c-1.574-.079-3.152-.078-4.725-.16a118.34 118.34 0 00-6.215-.158c-2.628 0-5.25.104-7.877.16-2.503.053-4.437.106-5.806.159l-2.077.08V51.56h2c2.202 0 3.586-.398 4.402-.938.51-.352 1.118-1.261 1.118-3.622V27.48c0-2.51-.217-4.125-.529-5.023-.233-.67-.582-.98-1.117-1.15-.892-.285-2.258-.467-4.194-.467H5v-5.714l1.954-.045c4.523-.105 8.186-.447 11.02-1.003l.007-.002c2.832-.546 5.26-1.479 7.316-2.77l3.063-1.923z"
        fill="#DADEE5"
      />
      <Path
        d="M30.86 11v-.904l-.766.48c-2.234 1.403-4.84 2.396-7.829 2.973h-.001c-2.949.58-6.705.925-11.276 1.031l-.488.011v2.749h.5c2.004 0 3.546.186 4.648.537 1.014.322 1.701 1 2.08 2.087.398 1.145.612 2.969.612 5.516V45c0 2.551-.652 4.098-1.78 4.865-1.163.775-2.889 1.195-5.24 1.195h-.5V53.76l.52-.02c1.382-.053 3.325-.107 5.83-.16h.01c2.553-.107 5.186-.16 7.9-.16 2.179 0 4.276.053 6.294.16h.013c2.08.053 3.648.106 4.708.16l.525.026V51.06h-.5c-2.028 0-3.362-.419-4.132-1.139-.7-.705-1.128-2.123-1.128-4.441V11z"
        fill="#fff"
        stroke="#97A2B6"
      />
    </Svg>
  );
}

export default SvgComponent;