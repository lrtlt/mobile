import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import CoverImage from '../../coverImage/CoverImage';
import LiveBadge from '../../liveBadge/LiveBadge';
import IC_CAMERA from '../../svg/ic_camera';
import IC_MICROPHONE from '../../svg/ic_microphone';
import {getIconForChannel, getColorsForChannel} from '../../../util/UI';
import {buildArticleImageUri, IMG_SIZE_L} from '../../../util/ImageUtil';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import TextComponent from '../../text/Text';
import {useTheme} from '../../../Theme';
import MediaIndicator from '../../mediaIndicator/MediaIndicator';
import {isLiveChannel, LiveChannel, TVChannel} from '../../../api/Types';

interface Props {
  data: TVChannel | LiveChannel;
  onPress: (channel: TVChannel | LiveChannel) => void;
}

const Channel: React.FC<Props> = ({data, onPress}) => {
  const {colors} = useTheme();

  const colorsSet = getColorsForChannel(data.channel);
  const channelIcon = getIconForChannel(data.channel, 32);
  const coverUrl = isLiveChannel(data) ? buildArticleImageUri(IMG_SIZE_L, data.photo) : data.cover_url;

  const programTimeComponent = isLiveChannel(data) ? (
    <View style={styles.liveFooTimeView} />
  ) : (
    <TextComponent style={{...styles.timeText, backgroundColor: colors.greyBackground}}>
      {data.time_start + ' - ' + data.time_end}
    </TextComponent>
  );

  const channelTitleComponent = isLiveChannel(data) ? (
    <View style={styles.channelTitleContainer}>
      <TextComponent style={styles.channelTitleLive}>LRT.LT</TextComponent>
    </View>
  ) : (
    <View style={styles.channelTitleContainer}>
      {data.is_radio ? <IC_MICROPHONE size={20} /> : <IC_CAMERA size={20} />}
      <TextComponent style={styles.channelTitle} numberOfLines={2}>
        {data.channel_title}
      </TextComponent>
    </View>
  );

  const bottomBarContainer = isLiveChannel(data) ? (
    <View />
  ) : (
    <View style={styles.bottomBarContainer}>
      <View
        style={{
          ...styles.bottomBar,
          backgroundColor: colorsSet.primary,
        }}
      />
      <View
        style={{
          ...styles.bottomBarOverlay,
          width: Math.max(0, Math.min(Number(data.proc), 100)) + '%',
          backgroundColor: colorsSet.secondary,
        }}
      />
    </View>
  );

  const liveBadge = isLiveChannel(data) ? <LiveBadge style={styles.liveBadge} /> : null;

  const onPressHandler = useCallback(() => {
    onPress(data);
  }, [data, onPress]);

  return (
    <View>
      <TouchableDebounce debounceTime={500} onPress={onPressHandler}>
        <View style={styles.container}>
          <View style={styles.coverContainer}>
            <CoverImage style={styles.cover} source={{uri: coverUrl}} />
            <View style={styles.coverContentContainer}>
              <View style={styles.channelImageContainer}>{channelIcon}</View>
              <View style={styles.mediaIndicatorContainer}>
                <MediaIndicator size="small" />
              </View>
              {programTimeComponent}
              {bottomBarContainer}
            </View>
          </View>

          {channelTitleComponent}
          {liveBadge}

          <TextComponent style={styles.title} numberOfLines={3}>
            {data.title}
          </TextComponent>
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default Channel;

const styles = StyleSheet.create({
  container: {
    margin: 2,
    borderRadius: 4,
    width: 180,
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  coverContainer: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  coverContentContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  cover: {
    width: '100%',
    aspectRatio: 0.66,
  },
  channelImageContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderBottomEndRadius: 4,
    alignSelf: 'flex-start',
  },
  mediaIndicatorContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelTitleContainer: {
    flexDirection: 'row',
    paddingTop: 2,
    alignItems: 'center',
  },
  channelTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    paddingStart: 8,
    fontFamily: 'SourceSansPro-Regular',
  },
  channelTitleLive: {
    fontSize: 12,
    textTransform: 'uppercase',
    paddingStart: 2,
    paddingVertical: 1,
    fontFamily: 'SourceSansPro-Regular',
  },
  liveBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  title: {
    width: '100%',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  timeText: {
    opacity: 0.8,
    fontSize: 12,
    fontFamily: 'SourceSansPro-Regular',
    borderRadius: 4,
    padding: 3,
    margin: 8,
    alignSelf: 'flex-end',
  },
  liveFooTimeView: {
    height: 44,
  },
  bottomBarContainer: {
    width: '100%',
    height: 8,
    borderBottomStartRadius: 4,
    borderBottomEndRadius: 4,
  },
  bottomBar: {
    width: '100%',
    height: 8,
    position: 'absolute',
  },
  bottomBarOverlay: {
    height: 8,
    position: 'absolute',
  },
});
