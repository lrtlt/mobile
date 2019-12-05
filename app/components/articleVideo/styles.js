import EStyleSheet from 'react-native-extended-stylesheet';
import { getSmallestDim } from '../../util/UI';

export default EStyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
  },
  mediaIndicator: {
    width: '$mediaIndicatorSize',
    height: '$mediaIndicatorSize',
    position: 'absolute',
    alignSelf: 'center',
    paddingStart: 4,
    borderRadius: '$mediaIndicatorSize / 2',
  },
  playerContainer: {
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: getSmallestDim() - 62,
  },
});
