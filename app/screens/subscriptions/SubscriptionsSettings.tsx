import React, {PropsWithChildren} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import SettingsSwitch from '../settings/SettingsSwitch';
import {Text} from '../../components';
import {useTheme} from '../../Theme';
import {useUserSubscriptions, useUpdateSubscription} from '../../api/hooks/usePushNotifications';
import {fetchCategoryPlaylist} from '../../api';
import {MainStackParamList} from '../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useHistoryCategories} from '../../api/hooks/useHistoryCategories';
import {navigateArticle} from '../../util/NavigationUtils';

interface SubscriptionsSettingsProps {}

const SubscriptionsSettings: React.FC<PropsWithChildren<SubscriptionsSettingsProps>> = ({}) => {
  const [isOpening, setIsOpening] = React.useState(false);

  const {colors} = useTheme();
  const {data: subscriptions, isLoading, isError} = useUserSubscriptions();
  const updateSubscriptionMutation = useUpdateSubscription();

  // Get existing subscription keys to exclude from recommendations
  const existingSubscriptionKeys = subscriptions?.map((sub) => sub.subscription_key) ?? [];

  // Fetch history categories from video/audio articles (excluding already subscribed)
  const {categories: historyCategories} = useHistoryCategories(10, existingSubscriptionKeys);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Subscriptions'>>();

  // Check if a category from history is already subscribed
  const isCategorySubscribed = (categoryId: number): boolean => {
    const subscriptionKey = `category-${categoryId}`;
    return subscriptions?.some((sub) => sub.subscription_key === subscriptionKey && sub.is_active) ?? false;
  };

  // Handle subscription toggle for history categories
  const onHistoryCategoryToggle = (categoryId: number, categoryTitle: string, value: boolean) => {
    updateSubscriptionMutation.mutate({
      name: categoryTitle,
      subscription_key: `category-${categoryId}`,
      is_active: value,
    });
  };

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

  if ((!subscriptions || subscriptions.length === 0) && historyCategories.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Aktyvių prenumeratų nėra.</Text>
      </View>
    );
  }

  const onPress = (key: String) => {
    const categoryId = key.substring('category-'.length);
    setIsOpening(true);
    fetchCategoryPlaylist(categoryId)
      .then((response) => {
        const article = response.articles?.[0];
        if (article) {
          navigateArticle(navigation, article);
        }
      })
      .finally(() => {
        setIsOpening(false);
      });
  };

  return (
    <View style={{opacity: isOpening ? 0.5 : 1}} pointerEvents={isOpening ? 'none' : 'auto'}>
      {subscriptions?.map((sub) => {
        return (
          <Pressable key={sub.subscription_key} onPress={() => onPress(sub.subscription_key)}>
            <SettingsSwitch
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

      {historyCategories.length > 0 && (
        <>
          {historyCategories.map((category) => (
            <Pressable key={category.id} onPress={() => onPress(`category-${category.id}`)}>
              <SettingsSwitch
                title={category.title}
                onValueChange={(value) => {
                  onHistoryCategoryToggle(category.id, category.title, value);
                }}
                value={isCategorySubscribed(category.id)}
              />
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
};

export default SubscriptionsSettings;
