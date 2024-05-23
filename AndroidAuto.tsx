import {Button, Text, View} from 'react-native';
import {CarPlay, ListTemplate} from 'react-native-carplay/src';
import {carPlayRootTemplate} from './app/car/root/createPlayRootTemplate';
import useCarPlayController from './app/car/useCarPlayController';
import {carPlayNewestTemplate} from './app/car/newest/createPlayNewestTemplate';
import {carPlayRecommendedTemplate} from './app/car/recommended/createPlayRecommendedTemplate';
import useCarPlayRecommendedPlaylist from './app/car/recommended/useCarRecommendedPlaylist';
import useCarRecommendedTemplate from './app/car/recommended/useCarRecommendedTemplate';

export function AndroidAutoModule() {
  console.log('AndroidAutoModule: init');

  CarPlay.registerOnConnect(() => {
    console.log('AndroidAutoModule: connected');
    // CarPlay.setRootTemplate(carPlayRootTemplate, false);
    CarPlay.setRootTemplate(carPlayRecommendedTemplate, false);
    setTimeout(() => {
      console.log('Updating template');

      const newTemplate = new ListTemplate({
        ...carPlayRecommendedTemplate.config,
        id: 'updated',
        items: [
          {
            text: 'Updated!',
          },
        ],
      });

      // carPlayrRecommendedTemplate.updateTemplate({
      //   ...carPlayRecommendedTemplate.config,
      //   id: 'updated',
      //   items: [
      //     {
      //       text: 'Updated!',
      //     },
      //   ],
      // });
      CarPlay.setRootTemplate(carPlayRootTemplate, false);
      CarPlay.bridge.toast('Updated!', 1000);
    }, 2000);
  });
  CarPlay.registerOnDisconnect(() => {
    console.log('AndroidAutoModule: disconnected');
  });
  CarPlay.emitter.addListener('backButtonPressed', () => {
    CarPlay.popTemplate();
  });
}

export function AndroidAuto() {
  // useCarRecommendedTemplate(true);

  return (
    <View>
      <Text>Hello Android Auto</Text>
      <Button
        title="Reload"
        onPress={() => {
          console.log('Reloading');
          CarPlay.bridge.reload();
        }}
      />
    </View>
  );
}
