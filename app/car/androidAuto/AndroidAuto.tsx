import {Image} from 'react-native';
import {Screen, ScreenManager} from 'react-native-android-auto/src';
import {useCarNavigation} from 'react-native-android-auto/src';
import {AutoRecommended} from './Recommended';
import useTrackPlayerSetup from '../carPlay/useTrackPlayerSetup';

export function AndroidAutoRoot() {
  useTrackPlayerSetup();
  console.log('# AndroidAutoRoot');
  return (
    <ScreenManager>
      <Screen name="root" render={Main} />
      <Screen name="recommended" render={AutoRecommended} />
    </ScreenManager>
  );
}

export function Main() {
  console.log('# AndroidAutoMain');
  const navigation = useCarNavigation();

  return (
    <grid-template key={'android-auto-main'} title="LRT.lt" isLoading={false}>
      <grid-item
        key={'recommended'}
        title="Siūlome"
        image={Image.resolveAssetSource(require('./assets/ic_star_2.png'))}
        onPress={() => {
          console.log('onPress recommended');
          navigation.push('recommended');
        }}
      />
      <grid-item
        key={'live'}
        title="Tiesiogiai"
        image={Image.resolveAssetSource(require('./assets/ic_play_2.png'))}
        onPress={() => {
          console.log('onPress live');
        }}
      />
      <grid-item
        key={'newest'}
        title="Naujausi"
        image={Image.resolveAssetSource(require('./assets/ic_news_2.png'))}
        onPress={() => {
          console.log('onPress newest');
        }}
      />
      <grid-item
        key={'podcasts'}
        title="Radijo laidos"
        image={Image.resolveAssetSource(require('./assets/ic_grid_2.png'))}
        onPress={() => {
          console.log('onPress podcasts');
        }}
      />
    </grid-template>
    // <list-template title={'LRT.lt'} isLoading={false}>
    //   <item-list header="Items">
    //     {[1, 2, 3].map((item) => (
    //       <row
    //         key={item}
    //         title={'titles - ' + item}
    //         texts={['text1', 'text2']}
    //         onPress={() => {
    //           console.log('onPress', item);
    //           //   navigation.push('deliveryList', {
    //           //     deliveryList: node,
    //           //   });
    //         }}
    //       />
    //     ))}
    //   </item-list>
    // </list-template>
  );
}
