import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
  },
  textBadge: {
    borderWidth: 1,
    borderColor: '$buttonBorderColor',
    padding: 4,
    fontSize: 14,
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    borderRadius: 4,
  },
  title: {
    padding: 4,
    fontSize: 22,
    marginLeft: 4,
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
  },
  text: {
    marginTop: 8,
    fontSize: 20,
    color: '$textColor',
    fontFamily: 'PlayfairDisplay-Regular',
  },
  textRed: {
    color: 'red',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'column',
    marginTop: 16,
  },
  buttonSpace: {
    width: 8,
  },
  button: {
    marginTop: 8,
  },
  buttonPositive: {
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#45a2ff',
  },
  buttonPositiveText: {
    fontSize: 14,
    color: '$white',
    fontFamily: 'SourceSansPro-SemiBold',
  },
  buttonNegativeText: {
    fontSize: 14,
    color: '#45a2ff',
    fontFamily: 'SourceSansPro-SemiBold',
  },
  buttonNegative: {
    padding: 14,
    alignItems: 'center',
  },
});
