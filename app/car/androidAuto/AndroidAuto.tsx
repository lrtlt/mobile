import {Screen, ScreenManager} from 'react-native-android-auto';

export function AndroidAutoRoot() {
  return (
    <ScreenManager>
      <Screen name="root" render={Main} />
      {/* <Screen name="deliveryList" render={DeliveryListScreen} />
      <Screen name="deliveryDetails" render={DeliveryDetails} /> */}
    </ScreenManager>
  );
}

import {useCarNavigation} from 'react-native-android-auto';

export function Main() {
  const navigation = useCarNavigation();

  return (
    <list-template title={'LRT.lt'} isLoading={false}>
      <item-list header="Items">
        {[1, 2, 3].map((item) => (
          <row
            key={item}
            title={'title - ' + item}
            texts={['text1', 'text2']}
            onPress={() => {
              console.log('onPress', item);
              //   navigation.push('deliveryList', {
              //     deliveryList: node,
              //   });
            }}
          />
        ))}
      </item-list>
    </list-template>
  );
}
