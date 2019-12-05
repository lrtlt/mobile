import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '$windowBackground',
  },
  column: {
    flex: 1,
    padding: 4,
    borderColor: '$buttonBorderColor',
    borderWidth: 0.8,
  },
  itemText: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },
  titleContainer: {
    borderColor: '$buttonBorderColor',
    borderWidth: 0.8,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-SemiBold',
    padding: 16,
    fontSize: 16,
  },
  separator: {
    height: 1,
    marginTop: 16,
    backgroundColor: '$listSeparator',
  },
});
