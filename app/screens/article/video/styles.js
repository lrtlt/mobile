import EStyleSheet from 'react-native-extended-stylesheet';
import { getSmallestDim } from '../../../util/UI';

export default EStyleSheet.create({
  container: {
    flex: 1,
    padding: '$contentPadding',
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
