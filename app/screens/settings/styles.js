import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },
  backButtonContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    justifyContent: 'center',
    height: '100%',
  },
  toggleButton: {
    width: 64,
    height: 44,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  controls: {
    width: '100%',
  },
  controlsLand: {
    width: '100%',
    marginStart: 100,
  },
  title: {
    width: '100%',
    padding: 2,
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    letterSpacing: 1,
    fontSize: 18,
    height: 40,
    marginTop: 12,
  },
  space: {
    width: 8,
    height: 8,
  },
  line: {
    width: '100%',
    height: 1,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '$greyBackground',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
  },
  textSmall: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
  },
  textNormal: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },

  textLarge: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 22,
  },
  textExtraLarge: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 30,
  },

  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});
