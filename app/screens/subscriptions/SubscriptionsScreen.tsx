import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../navigation/MainStack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, TouchableDebounce} from '../../components';
import {useTheme} from '../../Theme';
import RecommendedTab from './tabs/RecommendedTab';
import FollowedTab from './tabs/FollowedTab';
import AllShowsTab from './tabs/AllShowsTab';
import SearchTab from './tabs/SearchTab';
import {IconSearch} from '../../components/svg';
import NotificationBanner from './components/NotificationBanner';

type Props = {
  navigation: StackNavigationProp<MainStackParamList>;
};

type TabKey = 'rekomenduojame' | 'sekamos' | 'visos' | 'ieskoti';

const TABS: {key: TabKey; label: string}[] = [
  {key: 'rekomenduojame', label: 'Rekomenduojame'},
  {key: 'sekamos', label: 'Sekamos'},
  {key: 'visos', label: 'Visos'},
  {key: 'ieskoti', label: 'Ieškoti'},
];

const SubscriptionsScreen: React.FC<React.PropsWithChildren<Props>> = ({navigation}) => {
  const {colors} = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>('rekomenduojame');

  useEffect(() => {
    navigation.setOptions({headerTitle: 'PRENUMERATOS'});
  }, [navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <NotificationBanner />
      <View style={[styles.tabBarWrapper, {borderBottomColor: colors.listSeparator}]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}>
          {TABS.filter((t) => t.key !== 'ieskoti').map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableDebounce
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  {borderColor: isActive ? colors.primary : colors.listSeparator},
                  isActive && {backgroundColor: colors.mediatekaPlayButton},
                ]}>
                <Text style={[styles.tabLabel, {color: isActive ? colors.onPrimary : colors.text}]}>
                  {tab.label}
                </Text>
              </TouchableDebounce>
            );
          })}
          <View style={styles.tabSpacer} />
          {(() => {
            const tab = TABS.find((t) => t.key === 'ieskoti')!;
            const isActive = activeTab === tab.key;
            return (
              <TouchableDebounce
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  {borderColor: isActive ? colors.primary : colors.listSeparator},
                  isActive && {backgroundColor: colors.mediatekaPlayButton},
                ]}>
                <IconSearch size={16} color={isActive ? colors.onPrimary : colors.text} />
                <Text style={[styles.tabLabel, {color: isActive ? colors.onPrimary : colors.text}]}>
                  {tab.label}
                </Text>
              </TouchableDebounce>
            );
          })()}
        </ScrollView>
      </View>

      <View style={styles.content}>
        {activeTab === 'rekomenduojame' && <RecommendedTab />}
        {activeTab === 'sekamos' && <FollowedTab />}
        {activeTab === 'visos' && <AllShowsTab />}
        {activeTab === 'ieskoti' && <SearchTab />}
      </View>
    </SafeAreaView>
  );
};

export default SubscriptionsScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabBarWrapper: {},
  tabBarContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 4,
    minWidth: '100%',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
  },
  tabSpacer: {
    flex: 1,
  },
  tabLabel: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
});
