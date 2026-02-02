import React from 'react';
import {View, StyleSheet} from 'react-native';
import {strings, useTheme} from '../../../Theme';

import {useAuth0} from 'react-native-auth0';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import {IconApplicationSettings, IconBell, IconBookmarkNew, IconSubscribe} from '../../../components/svg';
import UserActionItem from './UserActionItem';
import {useArticleStorageStore} from '../../../state/article_storage_store';
import {useFavoriteUserArticleIds} from '../../../api/hooks/useFavoriteArticles';

const UserActions: React.FC = () => {
  const {user} = useAuth0();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const {colors} = useTheme();

  const handleFavorites = () => {
    navigation.navigate('Favorites');
  };

  const handleAppSettings = () => {
    navigation.navigate('Settings');
  };

  const handleNotifications = () => {
    navigation.navigate('Notifications');
  };

  const handleSubscriptions = () => {
    navigation.navigate('Subscriptions');
  };

  const {savedArticles} = useArticleStorageStore.getState();
  const {data: favoriteArticleIds} = useFavoriteUserArticleIds(!!user);
  const numberOfUnsavedArticles = user ? favoriteArticleIds?.length ?? 0 : savedArticles.length;

  return (
    <View style={styles.container}>
      <UserActionItem
        icon={<IconBookmarkNew size={32} color={colors.iconInactive} />}
        label={strings.bookmarks}
        caption={
          numberOfUnsavedArticles > 0 && !user
            ? 'Savo išsaugotus straipsnius pamatysite prisijungę prie LRT.lt'
            : undefined
        }
        numberOfItems={numberOfUnsavedArticles}
        onPress={user ? handleFavorites : undefined}
      />
      <UserActionItem
        icon={<IconBell size={32} color={colors.iconInactive} />}
        label={strings.notifications}
        onPress={user ? handleNotifications : undefined}
      />
      <UserActionItem
        icon={
          <View style={{padding: 2}}>
            <IconSubscribe size={32 - 4} color={colors.iconInactive} />
          </View>
        }
        label={strings.subscriptoions}
        onPress={user ? handleSubscriptions : undefined}
      />

      <UserActionItem
        icon={<IconApplicationSettings size={32} color={colors.iconInactive} />}
        label="PROGRAMĖLĖS NUSTATYMAI"
        onPress={handleAppSettings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});

export default UserActions;
