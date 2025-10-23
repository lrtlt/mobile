import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_3316_6067)">
        <Path
          d="M8 14l5.585-5.665a3.126 3.126 0 00-4.42-4.42L8 5 6.835 3.915a3.125 3.125 0 00-4.42 4.42L8 14z"
          fill={props.color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3316_6067">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
