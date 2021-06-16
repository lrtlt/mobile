import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import React from 'react';
import {TVChannel} from '../../../api/Types';
import {useTheme} from '../../../Theme';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import {getIconForChannel} from '../../../util/UI';
import DrawerItem from '../../drawerItem/DrawerItem';

import DrawerCollapsibleBlock from './DrawerCollapsibleBlock';

interface Props {
  navigation: DrawerNavigationHelpers;
  channels?: TVChannel[];
}

const DrawerBlockChannels: React.FC<Props> = ({channels, navigation}) => {
  const {strings, dim} = useTheme();
  if (!channels || channels.length <= 0) {
    console.log('invalid channels data');
    return null;
  }

  return (
    <DrawerCollapsibleBlock title={strings.channelScreenTitle}>
      {channels.map((channel) => {
        return (
          <DrawerItem
            key={channel.channel_title}
            text={channel.channel_title}
            iconComponent={getIconForChannel(channel.channel, dim.drawerIconSize)}
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Channel', {channelId: channel.channel_id});
            }}
          />
        );
      })}
    </DrawerCollapsibleBlock>
  );
};

export default React.memo(DrawerBlockChannels, (prev, next) => checkEqual(prev.channels, next.channels));
