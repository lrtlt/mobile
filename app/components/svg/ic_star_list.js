import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G
        clipPath="url(#clip0_3316_5471)"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M5.032 8H27.17M5.032 16h7.044M5.032 24h9.057M23.145 21.817L26.878 24l-1.015-4.074 3.32-2.725-4.358-.334L23.145 13l-1.679 3.867-4.358.334 3.32 2.725L19.413 24l3.732-2.183z" />
      </G>
      <Defs>
        <ClipPath id="clip0_3316_5471">
          <Path fill="#fff" d="M0 0H32.2025V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
