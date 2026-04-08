import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, TouchableDebounce} from '../../components';
import {useTheme} from '../../Theme';
import FollowedTab from './tabs/FollowedTab';
import AllSubscriptionsTab from './tabs/AllSubscriptionsTab';
import NotificationBanner from './components/NotificationBanner';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

type TabKey = 'sekamos' | 'visos';

const TABS: {key: TabKey; label: string}[] = [
  {key: 'sekamos', label: 'Mano'},
  {key: 'visos', label: 'Visos'},
];

const SubscriptionsScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {colors} = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('sekamos');

  useEffect(() => {
    navigation.setOptions({headerTitle: 'PRENUMERATOS'});
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <NotificationBanner />
      <View style={[styles.tabBarWrapper, {borderColor: colors.listSeparator}]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableDebounce
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                {borderColor: isActive ? colors.iconActive : colors.listSeparator},
                isActive && {backgroundColor: colors.iconActive},
              ]}>
              <Text style={[styles.tabLabel, {color: isActive ? colors.onPrimary : colors.text}]}>
                {tab.label}
              </Text>
            </TouchableDebounce>
          );
        })}
      </View>

      <View style={styles.content}>
        {activeTab === 'sekamos' && <FollowedTab />}
        {activeTab === 'visos' && <AllSubscriptionsTab />}
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabBarWrapper: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 12,
    overflow: 'hidden',
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 4,
  },
  tabLabel: {
    fontSize: 15,
  },
  content: {
    flex: 1,
  },
});
