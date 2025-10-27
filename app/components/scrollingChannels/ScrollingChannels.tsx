import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';
import {TVProgramChannel} from '../../api/Types';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {Box, Tiles} from '@grapp/stacks';
import ChannelV2 from './channel_v2/Channel_v2';
import {useCurrentProgram} from '../../api/hooks/useProgram';

interface Props {
  onChannelPress: (channel: TVProgramChannel) => void;
}

const ScrollingChannels: React.FC<React.PropsWithChildren<Props>> = ({onChannelPress}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {data} = useCurrentProgram();

  const {colors, strings} = useTheme();

  const onChannelPressHandler = useCallback(
    (channel: TVProgramChannel) => {
      onChannelPress(channel);
    },
    [onChannelPress],
  );

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, [navigation]);

  if (!data || data.tvprog?.items.length === 0) {
    return <View />;
  }

  const {items, live_items} = data.tvprog;

  const channelsContent =
    items &&
    items.map((item, i) => {
      return (
        <ChannelV2 data={item} key={`${i}-${item.proc}`} isLive={false} onPress={onChannelPressHandler} />
      );
    });

  const liveChannelsContent =
    live_items &&
    live_items.map((liveItem) => {
      return <ChannelV2 data={liveItem} key={liveItem.title} isLive={true} onPress={onChannelPressHandler} />;
    });

  return (
    <View style={{...styles.container}}>
      <View style={styles.topHeader}>
        <TextComponent style={styles.leftText} fontFamily="SourceSansPro-SemiBold">
          {strings.tvProgramTitle}
        </TextComponent>
        <TouchableDebounce onPress={onProgramPressHandler}>
          <TextComponent style={{...styles.rightText, color: colors.primary}}>
            {strings.tvProgram}
          </TextComponent>
        </TouchableDebounce>
      </View>
      <View style={styles.scrollContent}>
        <Box flex={'fluid'}>
          <Tiles space={2} columns={2} margin={1}>
            {liveChannelsContent}
            {channelsContent}
          </Tiles>
        </Box>
      </View>
    </View>
  );
};

export default ScrollingChannels;

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 2,
    padding: 4,
    paddingBottom: 8,
  },

  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  scrollContent: {
    flex: 1,
    flexDirection: 'row',
  },

  leftText: {
    fontSize: 18,
    textTransform: 'uppercase',
    padding: 8,
  },
  rightText: {
    fontSize: 15,
    textTransform: 'capitalize',
    padding: 8,
    margin: 8,
  },
});
