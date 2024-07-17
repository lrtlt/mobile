import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../Theme';

const SvgComponent = (props) => {
  const {dark, colors} = useTheme();

  return (
    <Svg
      width={props.height ? (props.height * 70) / 32 : 70}
      height={props.height || 32}
      fill="none"
      viewBox="0 0 70 32"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.536 17.56c1.896-.504 2.601-2.217 2.601-3.575 0-2.355-1.643-3.936-4.088-3.936H8.054v2.385h4.62c1.023 0 1.711.631 1.711 1.551 0 .92-.688 1.538-1.712 1.538H9.25v2.383h2.544l2.348 4.273h3.1l-2.705-4.62ZM18.338 10.049v2.38h3.242v9.745h2.699V12.43h3.24v-2.381h-9.181ZM2.772 19.794v-9.745H.075v12.126h7.978v-2.381h-5.28ZM46.382 12.468h3.484v9.71h2.721v-9.71h3.467v-2.405h-9.672v2.405ZM66.726 10.063l-3.23 9.029-3.247-9.028h-3.074l4.675 12.114h3.294L69.8 10.063h-3.074Z"
        fill={props.color ? props.color : dark ? colors.headerTint : '#1C2142'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.619 31.926h2.698V.305H35.62v31.621Z"
        fill={props.color ? props.color : '#2C478B'}
      />
    </Svg>
  );
};

export default SvgComponent;
