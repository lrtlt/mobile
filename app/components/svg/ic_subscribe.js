import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 13 13" fill="none" {...props}>
      <Path
        d="M6.5 0A6.5 6.5 0 1013 6.5 6.508 6.508 0 006.5 0zM9 7H7v2a.5.5 0 11-1 0V7H4a.5.5 0 010-1h2V4a.5.5 0 111 0v2h2a.5.5 0 010 1z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;
