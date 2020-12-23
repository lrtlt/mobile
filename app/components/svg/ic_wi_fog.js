import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 30 30" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M2.62 21.05c0-.24.08-.45.25-.61.17-.16.38-.24.63-.24h18.67a.821.821 0 01.85.85c0 .23-.08.43-.25.58-.17.16-.37.23-.6.23H3.5c-.25 0-.46-.08-.63-.23a.758.758 0 01-.25-.58zm2.62-3.14c0-.24.09-.44.26-.6.15-.15.35-.23.59-.23h18.67c.23 0 .42.08.58.24.16.16.23.35.23.59s-.08.44-.23.6c-.16.17-.35.25-.58.25H6.09c-.24 0-.44-.08-.6-.25a.816.816 0 01-.25-.6zm.13-2.39c0 .09.05.13.15.13h1.43c.06 0 .13-.05.2-.16.24-.52.59-.94 1.06-1.27.47-.33.99-.52 1.55-.56l.55-.07c.11 0 .17-.06.17-.18l.07-.5c.11-1.08.56-1.98 1.37-2.7.81-.72 1.76-1.08 2.85-1.08 1.08 0 2.02.36 2.83 1.07.8.71 1.26 1.61 1.37 2.68l.08.57c0 .11.07.17.2.17h1.59c.64 0 1.23.17 1.76.52s.92.8 1.18 1.37c.07.11.14.16.21.16h1.43c.12 0 .17-.07.14-.23-.29-1.02-.88-1.86-1.74-2.51-.87-.65-1.86-.97-2.97-.97h-.32c-.33-1.33-1.03-2.42-2.1-3.27s-2.28-1.27-3.65-1.27c-1.4 0-2.64.44-3.73 1.32s-1.78 2-2.09 3.36c-.85.2-1.6.6-2.24 1.21-.64.61-1.09 1.33-1.34 2.18v-.04c-.01 0-.01.03-.01.07zm1.61 8.59c0-.24.09-.43.26-.59.15-.15.35-.23.6-.23h18.68c.24 0 .44.08.6.23.17.16.25.35.25.58 0 .24-.08.44-.25.61-.17.17-.37.25-.6.25H7.84c-.23 0-.43-.09-.6-.26a.773.773 0 01-.26-.59z"
      />
    </Svg>
  );
}

export default SvgComponent;
