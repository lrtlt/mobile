import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useSettings} from '../../settings/useSettings';

import {themeDark, themeLight} from '../../Theme';

const SvgComponent = (props) => {
  const {isDarkMode} = useSettings();
  const colors = isDarkMode ? themeDark.colors : themeLight.colors;
  const color = colors.headerTint;

  return (
    <Svg width={props.width || 60} height={props.height || 32} fill="none" viewBox="0 0 60 32" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.072 17.256c1.844-.504 2.53-2.217 2.53-3.575 0-2.355-1.598-3.936-3.978-3.936h-4.86v2.385h4.495c.996 0 1.666.631 1.666 1.551 0 .92-.67 1.537-1.666 1.537H8.927v2.384h2.475l2.285 4.273h3.016l-2.631-4.62ZM17.77 9.745v2.38h3.155v9.745h2.626v-9.745h3.153v-2.38H17.77ZM2.625 19.49V9.744H0v12.126h7.763v-2.382H2.625ZM46.239 19.004c-.808 0-1.49.703-1.49 1.534 0 .831.682 1.534 1.49 1.534.807 0 1.489-.703 1.489-1.534 0-.831-.682-1.534-1.49-1.534ZM49.952 21.875h2.369V9.759h-2.37v12.116ZM59.224 19.573l-.098.1c-.108.112-.402.227-.708.227-.416 0-.684-.34-.684-.867V15.21h1.704v-2.154h-1.704v-2.365h-.261l-3.517 3.463v1.056h1.391v4.432c0 1.578.875 2.448 2.462 2.448 1.052 0 1.613-.314 1.898-.577l.037-.034-.52-1.906ZM34.584 31.622h2.626V0h-2.626v31.622Z"
        fill={color}
      />
    </Svg>
  );
};

export default SvgComponent;
