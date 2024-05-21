import {CarPlay} from 'react-native-carplay/src';

export function AndroidAutoModule() {
  CarPlay.emitter.addListener('didConnect', () => {
    console.log('AndroidAutoModule: connected');
  });
}
