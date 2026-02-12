import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ChannelResponse} from '../../api/Types';
import {Text, TouchableDebounce, VideoComponent} from '../../components';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {MainStackParamList} from '../../navigation/MainStack';
import {useTheme} from '../../Theme';
import {getIconForChannelById, getSmallestDim} from '../../util/UI';
import TextComponent from '../../components/text/Text';

import {CameraIcon, IconAudioReadCount} from '../../components/svg';
import DailyQuestionWrapper from '../../components/dailyQuestion/DailyQuestionWrapper';
import {StreamData} from '../../api/hooks/useStream';
import Divider from '../../components/divider/Divider';
import PulsingRedDot from '../../components/drawer2/components/PulsingRedDot';
import ChannelProgramComponent from './ChannelProgramComponent';

interface Props {
  channelData: ChannelResponse;
  streamData: StreamData;
  audioStreamData?: StreamData;
}

const isAudioChannel = (channelId: number) =>
  [
    4, // LRT Radijas
    5, // LRT Klasika
    6, // LRT Opus
    37, // LRT 100
  ].indexOf(channelId) !== -1;

const ChannelComponent: React.FC<React.PropsWithChildren<Props>> = ({
  channelData,
  streamData,
  audioStreamData,
}) => {
  const {channel_info, prog} = channelData;
  const chanelId = channel_info.channel_id;

  const [selectedStream, setSelectedStream] = useState(
    isAudioChannel(chanelId) ? audioStreamData ?? streamData : streamData,
  );

  const {colors, strings} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Channel'>>();

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, [navigation]);

  useEffect(() => {
    setSelectedStream(isAudioChannel(chanelId) ? audioStreamData ?? streamData : streamData);
  }, [channel_info]);

  // Safety check: if channel_info is missing or invalid, return null
  if (!channel_info || !channel_info.get_streams_url) {
    return null;
  }

  const isAudio = audioStreamData?.streamUri === selectedStream.streamUri;

  const streamSelectionComponent = audioStreamData ? (
    <View style={{...styles.streamSelectionContainer, borderColor: colors.primaryLight}}>
      <TouchableDebounce onPress={() => setSelectedStream(streamData)}>
        <View
          style={{
            ...styles.streamSelectionButton,
            backgroundColor: !isAudio ? colors.mediatekaPlayButton : colors.slugBackground,
          }}>
          <CameraIcon
            size={16}
            colorBase={!isAudio ? colors.onPrimary : colors.textSecondary}
            colorAccent={!isAudio ? colors.onPrimary : colors.textDisbled}
          />
          <TextComponent
            style={{
              ...styles.streamSelectionText,
              color: !isAudio ? colors.onPrimary : colors.text,
            }}>
            Video
          </TextComponent>
        </View>
      </TouchableDebounce>
      <TouchableDebounce
        style={{
          ...styles.streamSelectionButton,
          backgroundColor: isAudio ? colors.mediatekaPlayButton : colors.slugBackground,
        }}
        onPress={() => setSelectedStream(audioStreamData)}>
        <IconAudioReadCount size={16} color={isAudio ? colors.onPrimary : colors.textSecondary} />
        <TextComponent
          style={{
            ...styles.streamSelectionText,
            color: isAudio ? colors.onPrimary : colors.text,
          }}>
          Audio
        </TextComponent>
      </TouchableDebounce>
    </View>
  ) : undefined;

  return (
    <View style={{flex: 1}}>
      <View style={styles.playerContainer}>
        <VideoComponent
          key={selectedStream.streamUri}
          style={styles.player}
          autoPlay={true}
          backgroundImage={selectedStream.poster}
          title={channel_info.title}
          showTitle={false}
          streamUrl={channel_info.get_streams_url}
          streamData={selectedStream}
        />
      </View>
      {channel_info.daily_question && (
        <DailyQuestionWrapper id={channel_info.daily_question} contentMargin={12} />
      )}
      <View style={{...styles.programContainer, backgroundColor: colors.greyBackground}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          {getIconForChannelById(channel_info.channel_id)}
          {streamSelectionComponent}
        </View>

        {channel_info.channel_id === 1 ? (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
            }}>
            Transliaciją galima žiūrėti ir su dirbtiniu intelektu generuojamais subtitrais lietuvių, anglų,
            lenkų, ukrainiečių ir rusų kalbomis.
          </Text>
        ) : null}
        <Divider style={{marginVertical: 16}} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16}}>
          <PulsingRedDot />
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
            }}>
            Tiesiogiai
          </Text>
        </View>
        <ChannelProgramComponent prog={prog} channelInfo={channel_info} />

        <TouchableDebounce style={{paddingVertical: 16}} onPress={onProgramPressHandler}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.fullProgramText,
              color: colors.onPrimary,
              marginTop: prog !== undefined ? 8 : 0,
              backgroundColor: colors.mediatekaPlayButton,
              borderRadius: 8,
            }}>
            {strings.tvProgramButtonText}
          </Text>
        </TouchableDebounce>
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
    padding: 8,
    paddingTop: 16,
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
    fontSize: 16,
  },
  streamSelectionContainer: {
    // minWidth: '100%',
    flexDirection: 'row',
    gap: 0,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    borderRadius: 8,
  },
  streamSelectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    gap: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  streamSelectionText: {
    fontSize: 15,
  },
});
