import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  sectionHeaderText: {
    color: '$sectionHeaderTextColor',
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: '$sectionHeaderTextSize',
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: '$sectionPaddingTop',
    paddingBottom: '$sectionPaddingBottom',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingStart: '$articlePadding * 2',
    paddingEnd: '$articlePadding * 2',
  },
  separator: {
    flex: 1,
    height: 2,
    marginStart: '$articlePadding',
    marginEnd: '$articlePadding',
    marginTop: '$articlePadding / 2',
    marginBottom: '$articlePadding / 2',
    backgroundColor: '$sectionSeparatorColor',
  },

  slugContainer: {
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'baseline',
    borderColor: '$textColor',
    borderWidth: 1,
  },
  slugText: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$slugTitleTextSize',
  },
});
