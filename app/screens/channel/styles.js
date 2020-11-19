import EStyleSheet from 'react-native-extended-stylesheet';
import {getSmallestDim} from '../../util/UI';

//TODO remove unused styles
export default EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },
  screen: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollContainer: {
    minHeight: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  playerContainer: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  programContainer: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    padding: 8,
    paddingTop: 8,
    backgroundColor: '$greyBackground',
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: getSmallestDim() - 62,
  },
  channelTitleText: {
    color: '$textColor',
    width: '100%',
    marginBottom: 12,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 18,
  },
  fullProgramText: {
    color: '$textColor',
    width: '100%',
    minWidth: '100%',
    textAlign: 'center',
    padding: 16,
    marginTop: 8,
    backgroundColor: '$windowBackground',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },
  photo: {
    width: '100%',
  },
});
