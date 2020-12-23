import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 30 30" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M4.64 16.95c0-1.16.35-2.18 1.06-3.08s1.62-1.48 2.74-1.76c.31-1.36 1.01-2.48 2.1-3.36s2.34-1.31 3.75-1.31c1.38 0 2.6.43 3.68 1.28 1.08.85 1.78 1.95 2.1 3.29h.32c.89 0 1.72.22 2.48.66.76.44 1.37 1.04 1.81 1.8.44.76.67 1.59.67 2.48 0 1.32-.46 2.47-1.39 3.42-.92.96-2.05 1.46-3.38 1.5-.13 0-.2-.06-.2-.17v-1.33c0-.12.07-.18.2-.18.85-.04 1.58-.38 2.18-1.02s.9-1.38.9-2.23c0-.89-.32-1.65-.97-2.3s-1.42-.97-2.32-.97h-1.61c-.12 0-.18-.06-.18-.17l-.08-.58c-.11-1.08-.58-1.99-1.39-2.72-.82-.73-1.76-1.1-2.85-1.1-1.1 0-2.05.37-2.86 1.11-.81.74-1.27 1.65-1.37 2.75l-.06.5c0 .12-.07.19-.2.19l-.53.07c-.83.07-1.53.41-2.1 1.04s-.85 1.35-.85 2.19c0 .85.3 1.59.9 2.23s1.33.97 2.18 1.02c.11 0 .17.06.17.18v1.33c0 .11-.06.17-.17.17-1.34-.04-2.47-.54-3.4-1.5-.87-.96-1.33-2.11-1.33-3.43zm5.5 7.7a.816.816 0 01.82-.83c.23 0 .43.08.59.23s.24.35.24.59-.08.43-.24.59c-.16.16-.35.23-.59.23a.84.84 0 01-.59-.23.8.8 0 01-.23-.58zm.86-3.63c0-.22.08-.42.24-.58.16-.16.35-.24.59-.24.23 0 .43.08.59.24.16.16.24.36.24.58 0 .24-.08.44-.24.6-.16.17-.35.25-.59.25-.23 0-.43-.08-.59-.25a.814.814 0 01-.24-.6zm1.9 5.59c0-.23.08-.43.25-.61.16-.16.35-.24.57-.24.24 0 .44.08.61.25.17.17.25.37.25.6s-.08.43-.25.59c-.17.16-.37.24-.61.24-.23 0-.42-.08-.58-.24a.867.867 0 01-.24-.59zm.87-3.66c0-.24.08-.44.24-.62.16-.16.36-.24.58-.24.23 0 .43.08.6.25.17.17.25.37.25.61 0 .23-.08.43-.25.6s-.37.25-.6.25c-.23 0-.42-.08-.58-.25a.847.847 0 01-.24-.6zm.42-3.62c0-.23.08-.43.25-.6.18-.16.37-.24.57-.24.24 0 .44.08.61.25a.8.8 0 01.25.6c0 .23-.08.43-.25.59-.17.16-.37.24-.61.24-.23 0-.42-.08-.58-.24a.847.847 0 01-.24-.6zm2.37 5.32c0-.23.08-.43.24-.6.16-.15.36-.23.6-.23s.43.08.59.23c.16.16.23.35.23.59s-.08.43-.23.59c-.16.16-.35.23-.59.23s-.44-.08-.6-.24a.748.748 0 01-.24-.57zm.85-3.63c0-.22.08-.41.25-.58.17-.17.37-.25.6-.25.23 0 .43.08.59.24.16.16.24.36.24.58 0 .24-.08.44-.24.6-.16.17-.35.25-.59.25s-.44-.08-.6-.25a.816.816 0 01-.25-.59z"
      />
    </Svg>
  );
}

export default SvgComponent;
