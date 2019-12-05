import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$windowBackground',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 18,
  },
});

export default styles;
