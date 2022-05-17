import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {View} from 'react-native';
import {MenuItemChannels} from '../../../api/Types';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import {getIconForChannelById} from '../../../util/UI';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';

interface Props {
  navigation: DrawerNavigationHelpers;
  channels?: MenuItemChannels;
}

const DrawerBlockChannels: React.FC<Props> = ({channels, navigation}) => {
  if (!channels || channels.items.length <= 0) {
    console.log('invalid channels data');
    return null;
  }

  const {items, name} = channels;

  return (
    <DrawerCollapsibleBlock title={name}>
      {items.map((channel) => {
        return (
          <View
            key={channel.channel_id}
            style={{
              transform: [{scale: 0.9}, {translateX: -12}],
            }}>
            <DrawerItem
              key={channel.channel_title}
              // text={channel.channel_title}
              iconComponent={getIconForChannelById(channel.channel_id, {height: 32})}
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate('Channel', {channelId: channel.channel_id});
              }}
            />
          </View>
        );
      })}
    </DrawerCollapsibleBlock>
  );
};

export default React.memo(DrawerBlockChannels, (prev, next) => checkEqual(prev.channels, next.channels));
