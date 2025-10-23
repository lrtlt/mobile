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
      <G clipPath="url(#clip0_3316_5371)">
        <Path
          d="M28 17c-.509 6.16-5.709 11-12 11A12 12 0 014 16C4 9.709 8.84 4.509 15 4"
          stroke={props.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M16 9v7h7"
          stroke={props.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20 6a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM24.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM27.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          fill={props.color}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_3316_5371">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
