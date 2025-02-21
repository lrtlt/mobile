import {PropsWithChildren} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {TouchableDebounce} from '../../../../../../components';
import {IconPlay} from '../../../../../../components/svg';
import {useTheme} from '../../../../../../Theme';

interface Props {
  style?: ViewStyle;
  onPress: () => void;
}

const PlayButton: React.FC<PropsWithChildren<Props>> = ({style, onPress}) => {
  const {colors} = useTheme();
  return (
    <TouchableDebounce
      style={[
        styles.playButton,
        {
          backgroundColor: colors.radiotekaPlayButton,
        },
        style,
      ]}
      onPress={onPress}>
      <IconPlay size={14} />
    </TouchableDebounce>
  );
};

export default PlayButton;

const styles = StyleSheet.create({
  playButton: {
    flexDirection: 'row',
    width: 40,
    paddingLeft: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    aspectRatio: 1,
  },
});
