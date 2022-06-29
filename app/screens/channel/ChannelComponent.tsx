import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ChannelResponse} from '../../api/Types';
import {OpusNowPlaying, ProgramItem, Text, VideoComponent} from '../../components';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {MainStackParamList} from '../../navigation/MainStack';
import {useTheme} from '../../Theme';
import {getSmallestDim} from '../../util/UI';

/** Count of visible program items below player */
const PROGRAM_ITEMS_VISIBLE = 2;

interface Props {
  channelData: ChannelResponse;
}

const ChannelComponent: React.FC<Props> = ({channelData}) => {
  const {channel_info, prog} = channelData;
  const {colors, strings} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Channel'>>();

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, [navigation]);

  const programComponent = prog
    ? prog.map((item, i) => {
        if (i >= PROGRAM_ITEMS_VISIBLE) {
          return;
        }

        let opusNowPlayingComponent;
        if (i === 0 && channel_info.channel.toLowerCase().includes('opus')) {
          opusNowPlayingComponent = <OpusNowPlaying />;
        }

        const marginTop = i > 0 ? 8 : 0;

        return (
          <View key={item.time_start + item.title}>
            <ProgramItem
              style={{marginTop}}
              title={item.title}
              startTime={item.time_start}
              percent={item.proc}
              description={item.description}
            />
            {opusNowPlayingComponent}
          </View>
        );
      })
    : undefined;

  return (
    <View>
      <View style={styles.playerContainer}>
        <VideoComponent
          key={channel_info.channel_id}
          style={styles.player}
          autoPlay={true}
          backgroundImage={channel_info.player_background_image}
          title={channel_info.title}
          streamUrl={channel_info.get_streams_url}
        />
      </View>
      <View style={{...styles.programContainer, backgroundColor: colors.greyBackground}}>
        {programComponent}
        <TouchableOpacity onPress={onProgramPressHandler}>
          <Text style={{...styles.fullProgramText, backgroundColor: colors.background}}>
            {strings.tvProgramButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChannelComponent;

const styles = StyleSheet.create({
  playerContainer: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  programContainer: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    padding: 8,
    paddingTop: 8,
  },
  player: {
    width: '100%',
    aspectRatio: VIDEO_ASPECT_RATIO,
    maxHeight: getSmallestDim() - 62,
  },
  channelIconHolder: {
    marginTop: 12,
    marginBottom: 16,
  },
  fullProgramText: {
    width: '100%',
    minWidth: '100%',
    textAlign: 'center',
    padding: 16,
    marginTop: 8,
    fontSize: 16,
  },
});
