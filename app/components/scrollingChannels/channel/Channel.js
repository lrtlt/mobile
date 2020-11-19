import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CoverImage, LiveBadge} from '../..';
import MediaIcon from '../../mediaIndicator/MediaIndicator';
import IC_CAMERA from '../../svg/ic_camera';
import IC_MICROPHONE from '../../svg/ic_microphone';
import {getIconForChannel, getColorsForChannel} from '../../../util/UI';
import {buildArticleImageUri, IMG_SIZE_L} from '../../../util/ImageUtil';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import TextComponent from '../../text/Text';
import {useTheme} from '../../../Theme';

const Channel = (props) => {
  const {colors} = useTheme();

  const data = props.data;
  const proc = Math.max(0, Math.min(Number(data.proc), 100));
  const colorsSet = getColorsForChannel(data.channel);
  const channelIcon = getIconForChannel(data.channel, 32);

  const icon = data.is_radio ? <IC_MICROPHONE size={20} /> : <IC_CAMERA size={20} />;

  const startEndTimeText = data.time_start + ' - ' + data.time_end;

  let coverUrl = null;
  if (props.isLive) {
    coverUrl = buildArticleImageUri(IMG_SIZE_L, data.photo);
  } else {
    coverUrl = data.cover_url;
  }

  const programTimeComponent = props.isLive ? (
    <View style={styles.liveFooTimeView} />
  ) : (
    <TextComponent style={{...styles.timeText, backgroundColor: colors.greyBackground}}>
      {startEndTimeText}
    </TextComponent>
  );

  const channelTitleComponent = props.isLive ? (
    <View style={styles.channelTitleContainer}>
      <TextComponent style={{...styles.channelTitle, padding: 2}} numberOfLines={2}>
        LRT.LT
      </TextComponent>
    </View>
  ) : (
    <View style={styles.channelTitleContainer}>
      {icon}
      <TextComponent style={styles.channelTitle} numberOfLines={2}>
        {data.channel_title}
      </TextComponent>
    </View>
  );

  const bottomBarContainer = props.isLive ? (
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
          width: proc + '%',
          backgroundColor: colorsSet.secondary,
        }}
      />
    </View>
  );

  const liveBadge = props.isLive ? (
    <View style={{flexWrap: 'wrap'}}>
      <LiveBadge />
    </View>
  ) : null;

  return (
    <View>
      <TouchableDebounce debounceTime={500} onPress={() => props.onPress(props.data)}>
        <View style={styles.container}>
          <View style={styles.coverContainer}>
            <CoverImage style={styles.cover} source={{uri: coverUrl}} />
            <View style={styles.coverContentContainer}>
              <View style={styles.channelImageContainer}>{channelIcon}</View>
              <View style={styles.mediaIndicatorContainer}>
                <MediaIcon style={styles.mediaIndicator} />
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
  mediaIndicator: {
    opacity: 0.8,
    width: 36,
    height: 36,
    paddingStart: 4,
    borderRadius: 36 / 2,
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
