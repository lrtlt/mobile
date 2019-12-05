import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';

export default EStyleSheet.create({
  image: {
    width: '100%',
  },
  imageVertical: {
    width: '100%',
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  verticalImageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  verticalImageBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorContainer: {
    flex: 1,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    color: '$textColorSecondary',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
    marginTop: 4,
  },
});
