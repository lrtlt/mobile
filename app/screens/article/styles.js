import EStyleSheet from 'react-native-extended-stylesheet';
import { StyleSheet } from 'react-native';
import { getSmallestDim } from '../../util/UI';

export default EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: '$contentPadding',
  },
  gallery: {
    ...StyleSheet.absoluteFill,
  },
  summaryText: {
    color: '$textColor',
    marginTop: 24,
    marginBottom: 24,
    lineHeight: 32,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$articleSummaryTextSize',
  },
  photo: {
    width: '100%',
  },
  playerContainer: {
    width: '100%',
    backgroundColor: '#121212',
    alignItems: 'center',
  },
  player: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: getSmallestDim() - 62,
  },
  audioPlayer: {
    flex: 1,
    marginTop: '$contentPadding',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
