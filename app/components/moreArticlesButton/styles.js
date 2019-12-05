import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$greyBackground',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: '$articlePadding',
  },
  title: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    padding: '$articlePadding',
    fontSize: 16,
  },
});

export default styles;
