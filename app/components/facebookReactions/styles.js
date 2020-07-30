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
    paddingTop: 1,
    paddingBottom: 1,
    paddingEnd: 4,
    borderRadius: 4,
  },
  icon: {},
  countText: {
    color: '$facebook',
    paddingStart: 4,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$categoryTextSize',
  },
});
