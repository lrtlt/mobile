import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    backgroundColor: '$subtitleColor',
    padding: 4,
    borderRadius: 4,
    flexDirection: 'row',
  },
  text: {
    flexWrap: 'wrap',
    color: '$white',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 13,
  },
});
