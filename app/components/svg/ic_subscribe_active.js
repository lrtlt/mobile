import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 13 13" fill="none" {...props}>
      <Path
        d="M6.5 0A6.5 6.5 0 1013 6.5 6.507 6.507 0 006.5 0zm2.854 5.354l-3.5 3.5a.5.5 0 01-.708 0l-1.5-1.5a.5.5 0 11.708-.708L5.5 7.793l3.146-3.147a.5.5 0 11.708.708z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;
