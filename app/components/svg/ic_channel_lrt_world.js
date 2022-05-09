import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../Theme';

const SvgComponent = (props) => {
  const {dark, colors} = useTheme();
  return (
    <Svg width={props.size || 148} height={props.size || 32} fill="none" viewBox="0 0 148 32" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.22 17.461c1.995-.51 2.738-2.243 2.738-3.617 0-2.383-1.73-3.984-4.303-3.984H8.398v2.414h4.862c1.077 0 1.802.64 1.802 1.57S14.337 15.4 13.26 15.4H9.655v2.411h2.678l2.471 4.325h3.263l-2.847-4.675ZM19.223 9.86v2.41h3.411v9.861h2.84v-9.86h3.411V9.86h-9.662ZM2.84 19.722V9.861H0v12.27h8.397v-2.409H2.84ZM51.606 9.875H48.76v12.26h8.148v-2.433h-5.303V9.875ZM58.81 22.135h2.844V9.875h-2.845v12.26ZM63.465 12.309h3.667v9.827h2.864v-9.827h3.648V9.875h-10.18v2.434ZM84.071 17.139c0 1.73-1.064 2.762-2.847 2.762-1.794 0-2.865-1.033-2.865-2.762V9.875h-2.883v7.354c0 3.256 2.095 5.124 5.748 5.124s5.748-1.874 5.748-5.142V9.875h-2.901v7.264ZM96.308 9.875h-3.467l-4.919 12.26h3.234l.79-2.048h5.257l.771 2.048h3.235L96.329 9.93l-.02-.054Zm.1 7.778h-3.665l1.832-4.873 1.832 4.873ZM111.312 17.3l-5.654-7.39-.026-.035h-2.877v12.26h2.845v-7.713l5.849 7.713h2.708V9.875h-2.845V17.3ZM117.144 22.135h2.844V9.875h-2.844v12.26ZM131.933 18.189c-.549 1.04-1.678 1.712-2.875 1.712-2.227 0-3.843-1.634-3.843-3.886 0-2.253 1.616-3.888 3.843-3.888 1.169 0 2.324.689 2.875 1.714l.039.073 2.454-1.163-.045-.077c-.803-1.368-2.379-2.998-5.323-2.998-3.919 0-6.764 2.665-6.764 6.339 0 3.673 2.845 6.338 6.764 6.338 2.332 0 4.123-1.014 5.322-3.016l.047-.077-2.455-1.145-.039.074ZM143.121 9.929l-.021-.054h-3.467l-4.92 12.26h3.234l.791-2.048h5.257l.77 2.048H148L143.121 9.93Zm.077 7.725h-3.664l1.832-4.874 1.832 4.874Z"
        fill={dark ? colors.headerTint : '#1C2142'}
      />
      <Path fillRule="evenodd" clipRule="evenodd" d="M37.407 32h2.84V0h-2.84v32Z" fill="#64B445" />
    </Svg>
  );
};

export default SvgComponent;
