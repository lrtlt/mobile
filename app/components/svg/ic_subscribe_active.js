import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg width={props.size} height={props.size} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        d="M15.001 6.125a3.603 3.603 0 01-1.062 2.563L8.357 14.35a.5.5 0 01-.712 0L2.064 8.688a3.626 3.626 0 015.125-5.132l.812.76.818-.762a3.625 3.625 0 016.182 2.571z"
        fill={props.color}
      />
    </Svg>
  );
}

export default SvgComponent;
