import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 58,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '$programItemColor',
  },
  elapsedIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
    backgroundColor: '$programProgressColor',
  },
  timeText: {
    paddingEnd: 8,
    paddingStart: 8,
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  titleText: {
    flex: 1,
    padding: 6,
    color: '$textColor',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 15,
  },
  titleTextUpcoming: {
    flex: 1,
    padding: 6,
    color: '$textColorSecondary',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 15,
  },
});
