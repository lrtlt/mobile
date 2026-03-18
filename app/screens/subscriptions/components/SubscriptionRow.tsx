import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Switch} from 'react-native-gesture-handler';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {CameraIcon, MicIcon} from '../../../components/svg';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import {fetchCategoryPlaylist} from '../../../api';
import {navigateArticle} from '../../../util/NavigationUtils';

interface Props {
  title: string;
  isSubscribed: boolean;
  onToggle: (value: boolean) => void;
  type?: 'mediateka' | 'radioteka';
  latestArticleDate?: string;
  categoryId?: number;
}

const SubscriptionRow: React.FC<Props> = ({
  type,
  title,
  isSubscribed,
  onToggle,
  latestArticleDate,
  categoryId,
}) => {
  const {dark, colors} = useTheme();
  const [isOpening, setIsOpening] = useState(false);

  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const formattedDate = useMemo(() => {
    if (!latestArticleDate) return undefined;
    const [datePart] = latestArticleDate.split(' ');
    const [year, month, day] = datePart.split(/[-.]/).map(Number);
    const articleDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Šiandien';
    if (diffDays === 1) return 'Vakar';
    if (diffDays <= 7) return `Prieš ${diffDays} d.`;
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Prieš ${weeks} sav.`;
    }
    return datePart;
  }, [latestArticleDate]);

  const onPress = () => {
    if (!categoryId || isOpening) return;
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
    <View style={[styles.row, {borderColor: colors.listSeparator}, isOpening && styles.opening]}>
      {type === 'mediateka' ? (
        <CameraIcon size={16} colorAccent={'#97A2B6A0'} colorBase={'#97A2B6'} />
      ) : type === 'radioteka' ? (
        <MicIcon size={16} colorAccent={'#97A2B6'} colorBase={'#97A2B6'} />
      ) : null}
      <View style={styles.titleArea}>
        <TouchableDebounce onPress={onPress} disabled={!categoryId || isOpening}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {latestArticleDate && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.latestArticleDate} type="secondary">
                Paskutinis įrašas:
              </Text>
              <Text style={styles.latestArticleDate}>{' ' + formattedDate}</Text>
            </View>
          )}
        </TouchableDebounce>
      </View>
      <View style={styles.right}>
        <Text style={[styles.label, {color: isSubscribed ? colors.text : colors.textSecondary}]}>
          {isSubscribed ? 'Sekate' : 'Sekti'}
        </Text>
        <Switch
          thumbColor={dark ? colors.text : colors.greyBackground}
          trackColor={{
            true: dark ? colors.textDisbled : colors.mediatekaPlayButton,
          }}
          onValueChange={onToggle}
          value={isSubscribed}
        />
      </View>
    </View>
  );
};

export default SubscriptionRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  opening: {
    opacity: 0.5,
  },
  titleArea: {
    flex: 1,
    paddingVertical: 4,
  },
  title: {
    fontSize: 16,
  },
  latestArticleDate: {
    fontSize: 13,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 14,
  },
});
