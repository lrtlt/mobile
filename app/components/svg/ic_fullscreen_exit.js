import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M7 9a2 2 0 002-2V3a1 1 0 00-2 0v4H3a1 1 0 000 2h4zM17 9a2 2 0 01-2-2V3a1 1 0 112 0v4h4a1 1 0 110 2h-4zM17 15a2 2 0 00-2 2v4a1 1 0 102 0v-4h4a1 1 0 100-2h-4zM9 17a2 2 0 00-2-2H3a1 1 0 100 2h4v4a1 1 0 102 0v-4z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;
