import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '$textColor',
    paddingTop: 16,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
  },
});
