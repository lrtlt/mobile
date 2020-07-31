import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    marginTop: '$tvPadding',
    marginBottom: '$tvPadding',
    padding: 4,
    backgroundColor: '$slugBackground',
    paddingBottom: 8,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  scrollContent: {
    flex: 1,
    flexDirection: 'row',
  },

  leftText: {
    color: '$textColor',
    fontSize: '$tvSectionTextSize',
    textTransform: 'uppercase',
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
