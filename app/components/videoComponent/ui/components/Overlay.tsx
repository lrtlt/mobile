import {StyleProp, ViewStyle} from 'react-native';
import {GRADIENT_COLORS} from '../MediaControls.constants';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  style?: StyleProp<ViewStyle>;
}
const Overlay: React.FC<Props> = ({style}) => {
  return <LinearGradient style={style} colors={GRADIENT_COLORS} useAngle={true} angle={0} />;
};
export default Overlay;
