import {Platform} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  $fabSize: 56,

  container: {
    width: '$fabSize',
    height: '$fabSize',
    alignItems: 'center',
    justifyContent: 'center',
  },

  touchArea: {
    width: '$fabSize',
    height: '$fabSize',
    borderRadius: '$fabSize / 2',
    backgroundColor: '$actionButtonColor',

    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 0,
  },
});
