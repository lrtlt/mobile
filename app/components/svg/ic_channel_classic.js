import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {useTheme} from '../../Theme';

const SvgComponent = (props) => {
  const {dark, colors} = useTheme();
  return (
    <Svg width={props.size || 124} height={props.size || 32} fill="none" viewBox="0 0 124 32" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.715 17.56c1.918-.504 2.633-2.217 2.633-3.575 0-2.355-1.664-3.936-4.138-3.936H8.152v2.385h4.676c1.036 0 1.733.631 1.733 1.551 0 .92-.697 1.537-1.733 1.537H9.362v2.384h2.576l2.377 4.273h3.138l-2.738-4.62ZM18.563 10.049v2.38h3.281v9.745h2.732V12.43h3.28v-2.381h-9.293ZM2.806 19.794v-9.745H.076v12.126h8.076v-2.381H2.806ZM57.237 10.063H53.85l-4.145 5.184v-5.184H46.97V22.18h2.736v-3.726l.854-1.008 3.616 4.734h3.38l-5.184-6.424 4.865-5.692ZM61.754 10.063h-2.736V22.18h7.837v-2.405h-5.101v-9.71ZM76.123 10.063h-3.335l-4.73 12.116h3.11l.759-2.025h5.056l.742 2.025h3.111l-4.693-12.063-.02-.053Zm.094 7.687h-3.524l1.763-4.816 1.761 4.816ZM87.167 14.634l-.036-.008c-1.237-.29-2.305-.54-2.305-1.237 0-.7.611-1.118 1.635-1.118 1.303 0 2.56.469 3.452 1.286l.068.062 1.53-1.996-.055-.05c-1.224-1.12-2.826-1.689-4.76-1.689-2.7 0-4.66 1.564-4.66 3.72 0 2.752 2.489 3.317 4.49 3.77l.176.042c1.274.31 2.28.556 2.28 1.348 0 .619-.623 1.243-2.015 1.243-1.946 0-3.2-.994-3.774-1.587l-.07-.072-1.492 2.073.049.049c1.25 1.258 3.035 1.923 5.16 1.923 3.077 0 4.914-1.464 4.914-3.916 0-2.77-2.541-3.363-4.587-3.843ZM93.967 22.179h2.737V10.064h-2.737v12.115ZM109.815 10.063h-3.386l-4.145 5.184v-5.184h-2.736V22.18h2.736v-3.726l.854-1.008 3.616 4.734h3.38l-5.184-6.424 4.865-5.692ZM119.056 10.116l-.02-.053h-3.335l-4.732 12.116h3.111l.76-2.025h5.056l.741 2.025h3.111l-4.692-12.063Zm.074 7.633h-3.524l1.762-4.816 1.762 4.816Z"
        fill={dark ? colors.headerTint : '#1C2142'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.055 31.926h2.731V.305h-2.731v31.621Z"
        fill="#603680"
      />
    </Svg>
  );
};

export default SvgComponent;
