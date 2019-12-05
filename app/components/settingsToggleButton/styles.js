import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  $corners: 4,

  container: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '$buttonBorderColor',
    borderRadius: '$corners',
  },
  touchArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$corners',
  },
});
