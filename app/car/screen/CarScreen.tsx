import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useSplashScreenState from '../../screens/splash/useSplashScreenState';
import {useCarPlay} from '../useCarPlay';
import {useSelector} from 'react-redux';
import {selectHomeChannels} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {themeDark} from '../../Theme';
import {ScrollView} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import {Text, TouchableDebounce, VideoComponent} from '../../components';
import {PlayListItem} from '../CarPlayContext';
import {set} from 'lodash';

const CarScreen: React.FC = () => {
  const {colors} = themeDark;

  const state = useSplashScreenState();
  const channelsData = useSelector(selectHomeChannels, checkEqual);

  const {playlist, setPlaylist, playItem} = useCarPlay();

  useEffect(() => {
    const playlist: PlayListItem[] =
      channelsData?.channels?.map((channel) => ({
        id: channel.channel_id,
        text: channel.channel_title,
        detailText: channel.title,
        isPlaying: false,
        imgUrl: channel.cover_url,
        streamUrl: channel.get_streams_url,
      })) || [];

    if (playlist.length > 0) {
      setPlaylist(playlist);
    }
  }, [channelsData]);

  let content;
  switch (true) {
    case state.isError:
      content = <Text>Error</Text>;
      break;
    case state.isLoading:
      content = <ActivityIndicator />;
      break;
    default:
      content = (
        <View style={{gap: 12}}>
          {playlist.map((item, index) => {
            return (
              <TouchableDebounce
                key={index}
                onPress={() => {
                  playItem(item);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 2,
                    borderColor: colors.buttonBorder,
                    borderRadius: 8,
                    overflow: 'hidden',
                    backgroundColor: item.isPlaying ? colors.greyBackground : 'black',
                  }}>
                  <View>
                    <FastImage style={{width: 70, height: 70}} source={{uri: item.imgUrl}} />
                  </View>
                  <View style={{margin: 12, flex: 1, gap: 6}}>
                    <Text style={{color: colors.text, fontSize: 18, textTransform: 'uppercase'}}>
                      {item.text}
                    </Text>
                    <Text style={{color: colors.textSecondary, flex: 1, fontSize: 14}}>
                      {item.detailText}
                    </Text>
                  </View>
                </View>
              </TouchableDebounce>
            );
          })}
        </View>
      );
      break;
  }

  const nowPlaying = playlist.find((item) => item.isPlaying);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'black'}} edges={['top', 'bottom']}>
      <View style={{flex: 1}}>
        {nowPlaying ? (
          <VideoComponent
            style={{width: '100%', aspectRatio: 16 / 9}}
            key={nowPlaying.streamUrl}
            autoPlay={true}
            streamUrl={nowPlaying?.streamUrl}
            title={nowPlaying.text}
            backgroundImage={nowPlaying.imgUrl}
          />
        ) : null}
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            margin: 12,
          }}>
          {content}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CarScreen;
