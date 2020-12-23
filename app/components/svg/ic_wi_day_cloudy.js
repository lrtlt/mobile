import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 30 30" width={props.size} height={props.size} {...props}>
      <Path
        fill={props.color}
        d="M1.56 16.9c0 .9.22 1.73.66 2.49s1.04 1.36 1.8 1.8c.76.44 1.58.66 2.47.66h10.83c.89 0 1.72-.22 2.48-.66.76-.44 1.37-1.04 1.81-1.8.44-.76.67-1.59.67-2.49 0-.66-.14-1.33-.42-2 .76-.92 1.14-2.03 1.14-3.3 0-.71-.14-1.39-.41-2.04-.27-.65-.65-1.2-1.12-1.67-.47-.47-1.02-.85-1.67-1.12-.65-.28-1.33-.41-2.04-.41-1.48 0-2.77.58-3.88 1.74-.77-.44-1.67-.66-2.7-.66-1.41 0-2.65.44-3.73 1.31a5.8 5.8 0 00-2.08 3.35c-1.12.26-2.03.83-2.74 1.73s-1.07 1.92-1.07 3.07zm1.71 0c0-.84.28-1.56.84-2.17.56-.61 1.26-.96 2.1-1.06l.5-.03c.12 0 .19-.06.19-.18l.07-.54c.14-1.08.61-1.99 1.41-2.71.8-.73 1.74-1.09 2.81-1.09 1.1 0 2.06.37 2.87 1.1a3.99 3.99 0 011.37 2.71l.07.58c.02.11.09.17.21.17h1.61c.88 0 1.64.32 2.28.96.64.64.96 1.39.96 2.27 0 .91-.32 1.68-.95 2.32-.63.64-1.4.96-2.28.96H6.49c-.88 0-1.63-.32-2.27-.97-.63-.65-.95-1.42-.95-2.32zm6.7-12.27c0 .24.08.45.24.63l.66.64c.25.19.46.27.64.25.21 0 .39-.09.55-.26s.24-.38.24-.62-.09-.44-.26-.59l-.59-.66a.888.888 0 00-.61-.24c-.24 0-.45.08-.62.25-.17.16-.25.36-.25.6zm5.34 4.43c.69-.67 1.51-1 2.45-1 .99 0 1.83.34 2.52 1.03s1.04 1.52 1.04 2.51c0 .62-.17 1.24-.51 1.84-.97-.96-2.13-1.44-3.49-1.44H17c-.25-1.09-.81-2.07-1.69-2.94zm1.63-5.28c0 .26.08.46.23.62s.35.23.59.23c.26 0 .46-.08.62-.23.16-.16.23-.36.23-.62V1.73c0-.24-.08-.43-.24-.59s-.36-.23-.61-.23c-.24 0-.43.08-.59.23s-.23.35-.23.59v2.05zm5.52 2.29c0 .26.07.46.22.62.21.16.42.24.62.24.18 0 .38-.08.59-.24l1.43-1.43c.16-.18.24-.39.24-.64 0-.24-.08-.44-.24-.6a.807.807 0 00-.59-.24c-.24 0-.43.08-.58.24l-1.47 1.43c-.15.19-.22.39-.22.62zm.79 11.84c0 .24.08.45.25.63l.65.63c.15.16.34.24.58.24s.44-.08.6-.25a.86.86 0 00.24-.62c0-.22-.08-.42-.24-.58l-.65-.65a.779.779 0 00-.57-.24c-.24 0-.44.08-.6.24-.17.16-.26.36-.26.6zm1.47-6.31c0 .23.09.42.26.58.16.16.37.24.61.24h2.04c.23 0 .42-.08.58-.23s.23-.35.23-.59-.08-.44-.23-.6-.35-.25-.58-.25h-2.04c-.24 0-.44.08-.61.25a.79.79 0 00-.26.6z"
      />
    </Svg>
  );
}

export default SvgComponent;