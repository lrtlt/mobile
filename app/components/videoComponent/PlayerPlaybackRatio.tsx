import {useEffect, useState} from 'react';
import {ViewStyle} from 'react-native';
import {THEOplayer} from 'react-native-theoplayer';
import {Text, TouchableDebounce} from '..';
import {themeLight} from '../../Theme';

interface Props {
  style?: ViewStyle;
  player: THEOplayer;
}

const PlayerPlaybackRatio: React.FC<React.PropsWithChildren<Props>> = ({style, player}) => {
  const [rate, setRate] = useState(player?.playbackRate ?? 1.0);

  const handleRateChange = () => {
    if (player) {
      if (player.playbackRate < 2) {
        setRate(player.playbackRate + 0.25);
      } else {
        setRate(0.5);
      }
    }
  };

  useEffect(() => {
    if (player) {
      player.playbackRate = rate;
    }
  }, [player, rate]);

  return (
    <TouchableDebounce
      style={[{minWidth: 30, alignItems: 'flex-end', justifyContent: 'center'}, style]}
      onPress={handleRateChange}
      hitSlop={12}>
      <Text
        style={{fontSize: 12, color: themeLight.colors.playerIcons}}
        fontFamily="SourceSansPro-SemiBold">{`${rate}x`}</Text>
    </TouchableDebounce>
  );
};

export default PlayerPlaybackRatio;
