import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useSplashScreenState from '../../screens/splash/useSplashScreenState';
import {useCarPlay} from '../useCarPlay';
import {useSelector} from 'react-redux';
import {selectHomeChannels} from '../../redux/selectors';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {themeDark, useTheme} from '../../Theme';

const CarScreen: React.FC = () => {
  const {colors} = themeDark;

  const state = useSplashScreenState();
  const channelsData = useSelector(selectHomeChannels, checkEqual);

  const {setPlaylist} = useCarPlay();

  let content;
  switch (true) {
    case state.isError:
      content = <Text>Error</Text>;
      break;
    case state.isLoading:
      content = <ActivityIndicator />;
      break;
    default:
      setPlaylist(
        channelsData?.channels?.map((channel) => ({
          text: channel.channel_title,
          detailText: channel.title,
          isPlaying: false,
          imgUrl: channel.cover_url,
        })) || [],
      );
      content = <Text>Default</Text>;
      break;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}} edges={['left', 'right']}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>{content}</View>
    </SafeAreaView>
  );
};

export default CarScreen;
