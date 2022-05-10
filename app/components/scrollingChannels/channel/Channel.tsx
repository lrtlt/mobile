import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import CoverImage from '../../coverImage/CoverImage';
import LiveBadge from '../../liveBadge/LiveBadge';
import {getIconForChannel, getColorsForChannel} from '../../../util/UI';
import {buildArticleImageUri, IMG_SIZE_L} from '../../../util/ImageUtil';

import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import TextComponent from '../../text/Text';
import {themeLight, useTheme} from '../../../Theme';
import {isLiveChannel, LiveChannel, TVChannel} from '../../../api/Types';
import {ThemeProvider} from '@react-navigation/native';
import {IconPlay} from '../../svg';

interface Props {
  data: TVChannel | LiveChannel;
  onPress: (channel: TVChannel | LiveChannel) => void;
}

const Channel: React.FC<Props> = ({data, onPress}) => {
  const {colors, dark} = useTheme();

  const colorsSet = getColorsForChannel(data.channel);
  const coverUrl = isLiveChannel(data) ? buildArticleImageUri(IMG_SIZE_L, data.photo) : data.cover_url;

  const bottomBarContainer = (
    <View style={styles.bottomBarContainer}>
      <View
        style={{
          ...styles.bottomBar,
          backgroundColor: dark ? colors.primary : colorsSet.secondary,
        }}
      />
      <View
        style={{
          ...styles.bottomBarOverlay,
          width: Math.max(0, Math.min(Number(data.proc), 100)) + '%',
          backgroundColor: dark ? colors.primary : colorsSet.secondary,
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
              <View style={styles.channelImageContainer}>
                <ThemeProvider value={themeLight}>
                  {getIconForChannel(data.channel, {height: 28})}
                </ThemeProvider>
                <View style={styles.playIconContainer}>
                  <IconPlay size={14} color={colorsSet.secondary} />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <TextComponent style={{...styles.timeText, color: dark ? colors.text : colorsSet.secondary}}>
              {data.time_start + ' - ' + data.time_end}
            </TextComponent>

            {bottomBarContainer}
            {liveBadge}

            <TextComponent style={styles.title} numberOfLines={3} fontFamily="PlayfairDisplay-Regular">
              {data.title}
            </TextComponent>
          </View>
        </View>
      </TouchableDebounce>
    </View>
  );
};

export default Channel;

const styles = StyleSheet.create({
  container: {
    margin: 2,
    width: 180,
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
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  cover: {
    width: '100%',
    aspectRatio: 0.66,
  },
  channelImageContainer: {
    transform: [
      {
        scale: 0.9,
      },
      {
        translateX: -6,
      },
    ],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 12,
    margin: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  playIconContainer: {
    marginHorizontal: 6,
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
  },
  channelTitleLive: {
    fontSize: 12,
    textTransform: 'uppercase',
    paddingStart: 2,
    paddingVertical: 1,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  title: {
    width: '100%',
    fontSize: 16,
    marginTop: 8,
  },
  timeText: {
    fontSize: 12.5,
    marginVertical: 6,
  },
  bottomContainer: {
    margin: 4,
  },
  bottomBarContainer: {
    width: '100%',
    height: 8,
    justifyContent: 'center',
  },
  bottomBar: {
    width: '100%',
    height: 1,
    position: 'absolute',
  },
  bottomBarOverlay: {
    height: 4,
    position: 'absolute',
  },
});
