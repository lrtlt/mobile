import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '$subtitleColor',
    padding: 4,
    borderRadius: 4,
  },
  text: {
    color: '$white',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 15,
  },
});
