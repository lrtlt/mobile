import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ChannelResponse} from '../../api/Types';
import {OpusNowPlaying, ProgramItem, Text, TouchableDebounce, VideoComponent} from '../../components';
import {VIDEO_ASPECT_RATIO} from '../../constants';
import {MainStackParamList} from '../../navigation/MainStack';
import {useTheme} from '../../Theme';
import {getSmallestDim} from '../../util/UI';
import {StreamData} from '../../components/videoComponent/useStreamData';
import TextComponent from '../../components/text/Text';

import {CameraIcon, IconAudioReadCount} from '../../components/svg';
import DailyQuestionWrapper from '../../components/dailyQuestion/DailyQuestionWrapper';

/** Count of visible program items below player */
const PROGRAM_ITEMS_VISIBLE = 2;

interface Props {
  channelData: ChannelResponse;
  streamData: StreamData;
  audioStreamData?: StreamData;
}

const ChannelComponent: React.FC<React.PropsWithChildren<Props>> = ({
  channelData,
  streamData,
  audioStreamData,
}) => {
  const [selectedStream, setSelectedStream] = useState(streamData);

  const {channel_info, prog} = channelData;
  const {colors, strings} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Channel'>>();

  const onProgramPressHandler = useCallback(() => {
    navigation.navigate('Program');
  }, [navigation]);

  useEffect(() => {
    setSelectedStream(streamData);
  }, [channel_info]);

  const streamSelectionComponent = audioStreamData ? (
    <View style={{...styles.streamSelectionContainer, borderColor: colors.primaryLight}}>
      <TouchableDebounce onPress={() => setSelectedStream(streamData)}>
        <View
          style={{
            ...styles.streamSelectionButton,
            backgroundColor:
              selectedStream === streamData ? colors.mediatekaPlayButton : colors.slugBackground,
          }}>
          <CameraIcon
            size={16}
            colorBase={selectedStream === streamData ? colors.onPrimary : colors.textSecondary}
            colorAccent={selectedStream === streamData ? colors.onPrimary : colors.textDisbled}
          />
          <TextComponent
            style={{
              ...styles.streamSelectionText,
              color: selectedStream === streamData ? colors.onPrimary : colors.text,
            }}>
            Su vaizdu
          </TextComponent>
        </View>
      </TouchableDebounce>
      <TouchableDebounce
        style={{
          ...styles.streamSelectionButton,
          backgroundColor:
            selectedStream === audioStreamData ? colors.mediatekaPlayButton : colors.slugBackground,
        }}
        onPress={() => setSelectedStream(audioStreamData)}>
        <IconAudioReadCount
          size={16}
          color={selectedStream === audioStreamData ? colors.onPrimary : colors.textSecondary}
        />
        <TextComponent
          style={{
            ...styles.streamSelectionText,
            color: selectedStream === audioStreamData ? colors.onPrimary : colors.text,
          }}>
          Tik garsas
        </TextComponent>
      </TouchableDebounce>
    </View>
  ) : undefined;

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
    <View style={{flex: 1}}>
      <View style={styles.playerContainer}>
        <VideoComponent
          key={selectedStream.streamUri}
          style={styles.player}
          autoPlay={true}
          backgroundImage={selectedStream.poster}
          title={channel_info.title}
          streamUrl={selectedStream.streamUri}
          streamData={selectedStream}
        />
      </View>
      {channel_info.daily_question && (
        <DailyQuestionWrapper id={channel_info.daily_question} contentMargin={12} />
      )}
      <View style={{...styles.programContainer, backgroundColor: colors.greyBackground}}>
        {streamSelectionComponent}
        {channel_info.channel_id === 1 ? (
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              marginBottom: 12,
              textAlign: 'center',
              paddingVertical: 8,
            }}>
            Transliaciją galima žiūrėti ir su <Text style={{fontWeight: 'bold'}}>DI</Text> pagalba
            generuojamais subtitrais lietuvių, anglų, lenkų, ukrainiečių ir rusų kalba.
          </Text>
        ) : null}
        {programComponent}

        <TouchableDebounce onPress={onProgramPressHandler}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.fullProgramText,
              marginTop: programComponent !== undefined ? 8 : 0,
              backgroundColor: colors.background,
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
    fontSize: 16,
  },
  streamSelectionContainer: {
    // minWidth: '100%',
    marginBottom: 8,
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
