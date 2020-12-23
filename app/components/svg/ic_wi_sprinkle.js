import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 30 30" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M4.64 16.91c0-1.15.36-2.17 1.08-3.07a4.82 4.82 0 012.73-1.73c.31-1.36 1.01-2.48 2.1-3.35s2.35-1.31 3.76-1.31c1.38 0 2.6.43 3.68 1.27A5.88 5.88 0 0120.1 12h.31c.89 0 1.72.22 2.48.65s1.37 1.03 1.81 1.78c.44.75.67 1.58.67 2.47 0 1.34-.46 2.49-1.38 3.45s-2.05 1.47-3.38 1.51c-.13 0-.2-.06-.2-.17v-1.33c0-.12.07-.18.2-.18.86-.04 1.58-.38 2.18-1.02s.9-1.39.9-2.26-.32-1.62-.98-2.26c-.65-.64-1.42-.96-2.31-.96h-1.6c-.12 0-.19-.06-.19-.17l-.07-.58a4.108 4.108 0 00-1.38-2.71c-.82-.73-1.77-1.1-2.85-1.1-1.09 0-2.05.36-2.86 1.09-.81.73-1.27 1.63-1.38 2.71l-.06.54c0 .12-.07.18-.2.18l-.53.03c-.82.04-1.51.37-2.09 1s-.86 1.37-.86 2.22c0 .87.3 1.62.9 2.26s1.33.98 2.18 1.02c.11 0 .17.06.17.18v1.33c0 .11-.06.17-.17.17-1.34-.06-2.47-.57-3.4-1.53s-1.37-2.08-1.37-3.41zm5.93.88c0-.24.12-.57.37-.99.24-.42.47-.75.68-1.01.21-.24.34-.38.38-.42l.36.4c.26.28.5.61.72 1.02.22.4.33.74.33 1 0 .39-.13.72-.4.98s-.6.39-1 .39c-.39 0-.73-.13-1.01-.4-.29-.26-.43-.59-.43-.97zm2.98 3.99c0-.28.08-.59.24-.96s.35-.7.59-1.02c.18-.26.4-.54.67-.84.26-.3.46-.52.6-.65.07-.06.15-.14.24-.23l.24.23c.38.33.8.82 1.27 1.46.24.33.43.68.59 1.04s.23.68.23.97c0 .64-.23 1.19-.68 1.65s-1.01.68-1.66.68c-.64 0-1.19-.23-1.65-.67-.46-.46-.68-1.01-.68-1.66zm1.47-6.66c0-.42.32-.95.97-1.6l.24.25c.18.21.33.45.48.71.14.26.22.47.22.64 0 .26-.09.48-.28.66-.18.18-.4.28-.66.28-.27 0-.5-.09-.69-.28a.87.87 0 01-.28-.66z"
      />
    </Svg>
  );
}

export default SvgComponent;
