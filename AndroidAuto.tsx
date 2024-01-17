import {CarPlay} from 'react-native-carplay';

export function AndroidAutoModule() {
  CarPlay.emitter.addListener('didConnect', () => {
    console.log('AndroidAutoModule: connected');
  });
  return;
}
