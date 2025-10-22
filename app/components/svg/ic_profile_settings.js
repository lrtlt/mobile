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
      <G
        clipPath="url(#clip0_3316_5492)"
        stroke={props.color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round">
        <Path d="M25 9a2 2 0 100-4 2 2 0 000 4zM25 5V3.5M23.267 6l-1.298-.75M23.267 8l-1.298.75M25 9v1.5M26.733 8l1.298.75M26.733 6l1.298-.75M16 20a5 5 0 100-10 5 5 0 000 10zM7.975 24.921a9 9 0 0116.05 0M27.834 14A11.99 11.99 0 1118 4.166" />
      </G>
      <Defs>
        <ClipPath id="clip0_3316_5492">
          <Path fill="#fff" d="M0 0H32V32H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
