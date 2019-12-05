import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    paddingStart: 8,
    paddingEnd: 8,
    backgroundColor: '$lightGreyBackground',
  },
  countText: {
    color: '$darkIcon',
    paddingStart: 4,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$photoBadgeTextSize',
  },
});
