import React, {PropsWithChildren} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import SettingsSwitch from '../settings/SettingsSwitch';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {
  useUserSubscriptions,
  useUpdateSubscription,
  UserSubscription,
} from '../../api/hooks/usePushNotifications';
import {fetchCategoryPlaylist} from '../../api';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';

interface SubscriptionsSettingsProps {}

const SubscriptionsSettings: React.FC<PropsWithChildren<SubscriptionsSettingsProps>> = ({}) => {
  const [isOpening, setIsOpening] = React.useState(false);

  const {colors} = useTheme();
  const {data: subscriptions, isLoading, isError} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Subscriptions'>>();

  if (isLoading) {
    return (
      <View style={{padding: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{padding: 20}}>
        <Text type="secondary">Nepavyko gauti prenumeratų nustatymų. Bandykite dar kartą.</Text>
      </View>
    );
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Aktyvių prenumeratų nėra.</Text>
      </View>
    );
  }

  const onPress = (sub: UserSubscription) => {
    const categoryId = sub.subscription_key.substring('category-'.length);
    setIsOpening(true);
    fetchCategoryPlaylist(categoryId)
      .then((response) => {
        const article = response.articles?.[0];
        if (article) {
          if (article.is_audio) {
            navigation.navigate('Podcast', {articleId: article.id});
          } else if (article.is_video) {
            navigation.navigate('Vodcast', {articleId: article.id});
          } else {
            navigation.navigate('Article', {articleId: article.id});
          }
        }
      })
      .finally(() => {
        setIsOpening(false);
      });
  };

  return (
    <View style={{opacity: isOpening ? 0.5 : 1}} pointerEvents={isOpening ? 'none' : 'auto'}>
      {subscriptions.map((sub) => {
        return (
          <Pressable onPress={() => onPress(sub)}>
            <SettingsSwitch
              key={sub.subscription_key}
              title={sub.name || sub.subscription_key}
              onValueChange={(value) => {
                updateSubscriptionMutation.mutate({
                  name: sub.name || sub.subscription_key,
                  subscription_key: sub.subscription_key,
                  is_active: value,
                });
              }}
              value={sub.is_active}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

export default SubscriptionsSettings;
