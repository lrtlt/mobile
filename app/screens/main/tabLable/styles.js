import EStyleSheet from 'react-native-extended-stylesheet';

const label = {
  fontSize: 14,
  fontFamily: 'SourceSansPro-Regular',
  width: '100%',
  textTransform: 'uppercase',
  color: '$textColorSecondary',
};

export default EStyleSheet.create({
  homeContainer: {
    paddingStart: 6,
    paddingEnd: 6,
  },
  label: {
    ...label,
  },
  labelFocused: {
    ...label,
    color: '$tabLableSelectedColor',
  },
  labelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
