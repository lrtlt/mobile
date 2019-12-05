import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  article: {
    padding: '$articlePadding',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: '$articleExtraPaddingTop',
    paddingBottom: '$articleExtraPaddingBottom',
  },
});

export default styles;
