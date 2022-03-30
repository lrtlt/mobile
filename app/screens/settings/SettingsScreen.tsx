import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectSettings} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {checkEqual} from '../../util/LodashEqualityCheck';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import SettingsScreenView from './SettingsScreenView';

type ScreenRouteProp = RouteProp<MainStackParamList, 'Slug'>;
type ScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Slug'>;

type Props = {
  route: ScreenRouteProp;
  navigation: ScreenNavigationProp;
};

/**
 *
 * @deprecated
 */
const SettingsScreen: React.FC<Props> = ({navigation}) => {
  const {strings} = useTheme();
  const config = useSelector(selectSettings, checkEqual);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: strings.settings,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return <SettingsScreenView />;
};

export default SettingsScreen;
