import React from 'react';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';
import {useTheme} from '../../Theme';

function SvgComponent(props) {
  const {dark, colors} = useTheme();

  return (
    <Svg
      width={props.height ? (props.height * 76) / 32 : 76}
      height={props.size || 32}
      viewBox="0 0 76 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G
        clipPath="url(#clip0_2516_52)"
        fill={props.color ? props.color : dark ? colors.headerTint : '#222659'}>
        <Path d="M49.615 22.114v-8.88l-2.042 2.074-1.503-1.56 3.897-3.87h2.302v12.236h-2.654zM59.249 12.006c-1.782 0-2.45 1.742-2.45 3.999 0 2.256.668 4.018 2.45 4.018 1.763 0 2.431-1.762 2.431-4.018 0-2.257-.668-4-2.431-4zm0-2.312c3.526 0 5.122 3.155 5.122 6.31 0 3.156-1.596 6.33-5.122 6.33-3.545 0-5.123-3.174-5.123-6.33 0-3.155 1.578-6.31 5.123-6.31zM70.758 12.006c-1.782 0-2.45 1.742-2.45 3.999 0 2.256.668 4.018 2.45 4.018 1.763 0 2.431-1.762 2.431-4.018 0-2.257-.668-4-2.431-4zm0-2.312c3.526 0 5.122 3.155 5.122 6.31 0 3.156-1.596 6.33-5.122 6.33-3.545 0-5.123-3.174-5.123-6.33 0-3.155 1.578-6.31 5.123-6.31z" />
      </G>
      <Path
        d="M35.15 29.264h2.77V32h-2.77v-2.736zM35.15 17.558h2.92v2.736h-2.92v-2.736zM35.15 11.705h2.92v2.737h-2.92v-2.737zM35.15 5.853h2.92v2.736h-2.92V5.853zM38.069 0h-2.92v2.736h2.92V0zM35.151 23.411h2.919v2.736H35.15v-2.736z"
        fill="#00A494"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.306 17.449c1.875-.502 2.573-2.21 2.573-3.565 0-2.347-1.626-3.925-4.044-3.925H7.894v2.379h4.569c1.013 0 1.694.63 1.694 1.546 0 .918-.681 1.534-1.694 1.534H9.075v2.376h2.517l2.323 4.261h3.066l-2.675-4.606zM18.067 9.962v2.374h3.207v9.717h2.67v-9.717h3.206V9.962h-9.083zM2.668 19.678V9.962H0v12.09h7.893v-2.374H2.668z"
        fill={props.color ? props.color : dark ? colors.headerTint : '#222659'}
      />
      <Defs>
        <ClipPath id="clip0_2516_52">
          <Path fill="#fff" transform="translate(46.07 9.694)" d="M0 0H29.8107V12.6397H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
