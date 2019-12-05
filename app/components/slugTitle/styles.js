import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 8,
    alignSelf: 'baseline',
    borderColor: '$textColor',
    borderWidth: 1,
    //backgroundColor: Colors.primaryDark,
  },
  text: {
    color: '$textColor',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: '$slugTitleTextSize',
  },
});

export default styles;
