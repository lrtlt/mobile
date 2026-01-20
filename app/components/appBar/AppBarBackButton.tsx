import {PropsWithChildren} from 'react';
import useAppBarHeight from './useAppBarHeight';
import ActionButton from '../actionButton/ActionButton';
import {Image, Platform} from 'react-native';
import {useTheme} from '../../Theme';

interface Props {
  onPress: () => void;
}
const AppBarBackButton: React.FC<PropsWithChildren<Props>> = ({onPress}) => {
  const {colors, dim} = useTheme();

  const {actionBarHeigh} = useAppBarHeight();

  return (
    <ActionButton
      style={{
        height: actionBarHeigh,
      }}
      accessibilityLabel="atgal"
      onPress={onPress}>
      <Image
        source={require('../../../node_modules/@react-navigation/elements/src/assets/back-icon.png')}
        resizeMode="contain"
        fadeDuration={0}
        tintColor={colors.headerTint}
        style={{
          width: Platform.OS === 'ios' ? dim.appBarIconSize - 4 : dim.appBarIconSize,
          height: Platform.OS === 'ios' ? dim.appBarIconSize - 4 : dim.appBarIconSize,
        }}
      />
    </ActionButton>
  );
};

export default AppBarBackButton;
