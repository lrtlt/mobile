import Svg, {Rect} from 'react-native-svg';

function SvgComponent(props) {
  const color = props.color ?? '#97A2B6';
  return (
    <Svg width={props.size} height={props.size} viewBox="-1 -1 16 16" fill="none" {...props}>
      <Rect x={0} y={8} width={6} height={6} rx={1} fill={color} />
      <Rect x={0} y={0} width={6} height={6} rx={1} fill={color} />
      <Rect x={8} y={0} width={6} height={6} rx={0.5} fill={color} />
      <Rect x={8} y={8} width={6} height={6} rx={1} fill={color} />
    </Svg>
  );
}

export default SvgComponent;
