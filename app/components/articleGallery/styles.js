import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  $spacing: '$contentPadding',

  container: {
    width: '100%',
    paddingTop: 24,
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  imageCountOverlay: {
    flex: 1,
    backgroundColor: 'rgba(34, 44, 53, 0.8)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  imageCountOverlayText: {
    color: '$white',
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 40,
  },
  space: {
    width: '$spacing',
    height: '$spacing',
  },
  row: {
    paddingTop: '$spacing',
    width: '100%',
    flexDirection: 'row',
  },
  image: {
    flex: 1,
  },
});
