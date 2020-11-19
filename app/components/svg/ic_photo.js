import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../Theme';

const SvgComponent = (props) => {
  const {colors} = useTheme();
  return (
    <Svg {...props} viewBox="0 0 58 58" width={props.size} height={props.size}>
      <Path
        fill={colors.textSecondary}
        d="M57 6H1a1 1 0 00-1 1v44a1 1 0 001 1h56a1 1 0 001-1V7a1 1 0 00-1-1zm-1 44H2V8h54v42z"
      />
      <Path
        fill={colors.textSecondary}
        d="M16 28.138a5.575 5.575 0 005.569-5.568c0-3.072-2.498-5.57-5.569-5.57s-5.569 2.498-5.569 5.569A5.575 5.575 0 0016 28.138zM16 19c1.968 0 3.569 1.602 3.569 3.569S17.968 26.138 16 26.138s-3.569-1.601-3.569-3.568S14.032 19 16 19zM7 46c.234 0 .47-.082.66-.249l16.313-14.362L34.275 41.69a.999.999 0 101.414-1.414l-4.807-4.807 9.181-10.054 11.261 10.323a1 1 0 001.351-1.475l-12-11a1.031 1.031 0 00-.72-.262 1.002 1.002 0 00-.694.325l-9.794 10.727-4.743-4.743a1 1 0 00-1.368-.044L6.339 44.249A1 1 0 007 46z"
      />
    </Svg>
  );
};

export default SvgComponent;
