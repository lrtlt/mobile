import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  root: {},
  rootSelected: {
    backgroundColor: '$slugBackground',
  },
  text: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$drawerItemTextSize',
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginStart: 8,
  },
});
