import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    paddingStart: 6,
    paddingEnd: 6,
    backgroundColor: '$lightGreyBackground',
  },
  countText: {
    color: '$darkIcon',
    paddingStart: 4,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$photoBadgeTextSize',
  },
});
