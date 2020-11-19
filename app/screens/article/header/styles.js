import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  root: {
    flex: 1,
  },
  categoryContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    flexDirection: 'row',
  },
  facebookReactions: {
    marginTop: 8,
  },
  smallText: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
  },
  smallTextBold: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
  },
  authorShareContainer: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flex: 1,
  },
  greyDot: {
    backgroundColor: '$buttonContentColor',
    width: 4,
    height: 4,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 2,
    borderRadius: 2,
  },
  titleText: {
    marginTop: 24,
    color: '$titleTextColor',
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 25,
  },
  subtitle: {
    color: '$subtitleColor',
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 4,
    fontSize: 15,
  },
});
