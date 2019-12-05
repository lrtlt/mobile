import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  photo: {
    width: '100%',
  },
  videoImageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaIndicator: {
    width: 44,
    height: 44,
    position: 'absolute',
    alignSelf: 'center',
    paddingStart: 4,
    borderRadius: 22,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '$white',
    marginTop: 12,
    fontSize: 15,
  },
});
