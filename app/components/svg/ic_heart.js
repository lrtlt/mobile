import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_3316_5453)">
        <Path
          d="M16 28l11.17-11.33a6.251 6.251 0 00-8.84-8.84L16 10l-2.33-2.17a6.25 6.25 0 00-8.84 8.84L16 28z"
          stroke={props.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

export default SvgComponent;
