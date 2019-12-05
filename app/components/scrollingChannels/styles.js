import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    marginTop: '$tvPadding',
    marginBottom: '$tvPadding',
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContent: {
    flex: 1,
    flexDirection: 'row',
  },

  leftText: {
    color: '$textColor',
    fontSize: '$tvSectionTextSize',
    margin: '$articlePadding',
    fontFamily: 'SourceSansPro-SemiBold',
  },

  rightText: {
    color: '$textColor',
    fontSize: '$tvSectionTextSize - 2',
    margin: '$articlePadding',
    fontFamily: 'SourceSansPro-Regular',
  },
});
