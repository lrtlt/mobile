import React, {useEffect} from 'react';

import {useTheme} from '../../Theme';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import SettingsScreenView from './SettingsScreenView';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

const SettingsScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {strings} = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.settings,
    });
  }, []);

  return <SettingsScreenView />;
};

export default SettingsScreen;
