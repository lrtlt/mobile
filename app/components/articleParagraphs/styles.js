import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  paragraphContainer: {
    flex: 1,
    paddingTop: '$paragraphSpacing',
    paddingBottom: '$paragraphSpacing',
  },
  embedContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  quoteText: {
    flex: 1,
  },
  quoteContainer: {
    width: '100%',
    marginTop: '$contentPadding',
    flexDirection: 'row',
  },
  quoteSimbol: {
    fontFamily: 'SourceSansPro-SemiBold',
    color: '$textColor',
    fontSize: 80,
    marginTop: -18,
    paddingEnd: '$contentPadding',
  },
});
