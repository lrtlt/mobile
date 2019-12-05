import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  text: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$drawerItemTextSize',
    textTransform: 'uppercase',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '$drawerPadding',
    marginStart: '$drawerPadding',
  },
  iconContainer: {
    paddingRight: '$drawerPadding',
  },
});
