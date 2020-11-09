import React from 'react';
import {View, Text} from 'react-native';
import {CoverImage, LiveBadge} from '../..';
import MediaIcon from '../../mediaIndicator/MediaIndicator';
import Styles from './styles';
import IC_CAMERA from '../../svg/ic_camera';
import IC_MICROPHONE from '../../svg/ic_microphone';
import {getIconForChannel, getColorsForChannel} from '../../../util/UI';
import {buildArticleImageUri, IMG_SIZE_L} from '../../../util/ImageUtil';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';

const channel = (props) => {
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
    <View style={Styles.timeText} />
  ) : (
    <Text style={Styles.timeText}>{startEndTimeText}</Text>
  );

  const channelTitleComponent = props.isLive ? (
    <View style={Styles.channelTitleContainer}>
      <Text style={{...Styles.channelTitle, paddingStart: 2, padding: 2}} numberOfLines={2}>
        LRT.LT
      </Text>
    </View>
  ) : (
    <View style={Styles.channelTitleContainer}>
      {icon}
      <Text style={Styles.channelTitle} numberOfLines={2}>
        {data.channel_title}
      </Text>
    </View>
  );

  const bottomBarContainer = props.isLive ? (
    <View />
  ) : (
    <View style={Styles.bottomBarContainer}>
      <View
        style={{
          ...Styles.bottomBar,
          backgroundColor: colorsSet.primary,
        }}
      />
      <View
        style={{
          ...Styles.bottomBarOverlay,
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
        <View style={Styles.container}>
          <View style={Styles.coverContainer}>
            <CoverImage style={Styles.cover} source={{uri: coverUrl}} />
            <View style={Styles.coverContentContainer}>
              <View style={Styles.channelImageContainer}>{channelIcon}</View>
              <View style={Styles.mediaIndicatorContainer}>
                <MediaIcon style={Styles.mediaIndicator} />
              </View>

              {programTimeComponent}
              {bottomBarContainer}
            </View>
          </View>

          {channelTitleComponent}
          {liveBadge}

          <Text style={Styles.title} numberOfLines={3}>
            {data.title}
          </Text>
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default React.memo(channel);
