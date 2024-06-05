import {Image} from 'react-native';
import useCarPlayRecommendedPlaylist from '../carPlay/recommended/useCarRecommendedPlaylist';
import {useMemo} from 'react';
import {useMediaPlayer} from '../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../components/videoComponent/context/PlayerContext';

export function AutoRecommended() {
  const {channels, reload} = useCarPlayRecommendedPlaylist(true);

  const {setPlaylist} = useMediaPlayer();

  const rows = useMemo(() => {
    return channels.map((item, index) => (
      <row
        key={item.id}
        title={item.text}
        // texts={item.detailText ? [item.detailText] : undefined}
        image={Image.resolveAssetSource({
          uri: item.imgUrl,
          width: 200,
          height: 200,
          scale: 1,
        })}
        onPress={() => {
          setPlaylist(
            channels.map((item) => ({
              uri: item.streamUrl,
              mediaType: MediaType.AUDIO,
              isLiveStream: false,
              poster: item.imgUrl,
              title: item.text,
            })),
            index,
          );

          console.log('onPress');
        }}
      />
    ));
  }, [channels]);

  return (
    <list-template
      title={'Siūlome'}
      isLoading={channels.length <= 0}
      headerAction="back"
      actionStrip={{
        actions: [
          {
            title: 'Atnaujinti',
            onPress: reload,
          },
        ],
      }}>
      <item-list header="Siūlome">{rows}</item-list>
    </list-template>
  );
}
