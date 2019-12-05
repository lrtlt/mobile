import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  root: {
    alignSelf: 'baseline',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '$buttonBorderColor',
    borderWidth: 1,
    paddingStart: 4,
    paddingTop: 0.5,
    paddingBottom: 0.5,
    paddingEnd: 4,
    borderRadius: 4,
  },
  icon: {
    marginTop: 2,
  },
  countText: {
    color: '$facebook',
    paddingStart: 4,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$categoryTextSize',
  },
});
