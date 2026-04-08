import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {CameraIcon, IconCheckCircle, IconPlusCircle, IconSquares, MicIcon} from '../../../components/svg';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../navigation/MainStack';
import {fetchCategoryPlaylist} from '../../../api';
import {navigateArticle} from '../../../util/NavigationUtils';

interface Props {
  title: string;
  isSubscribed: boolean;
  onToggle: (value: boolean) => void;
  type?: 'mediateka' | 'radioteka' | 'rubrikos';
  latestArticleDate?: string;
  categoryId?: number;
  isRecommended?: boolean;
}

const SubscriptionRow: React.FC<Props> = ({
  type,
  title,
  isSubscribed,
  onToggle,
  latestArticleDate,
  categoryId,
  isRecommended,
}) => {
  const {colors} = useTheme();
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
        <CameraIcon size={16} colorAccent={colors.iconInactive} colorBase={colors.iconInactive} />
      ) : type === 'radioteka' ? (
        <MicIcon size={16} colorAccent={colors.iconInactive} colorBase={colors.iconInactive} />
      ) : type === 'rubrikos' ? (
        <IconSquares size={16} color={colors.iconInactive} />
      ) : null}
      <View style={styles.titleArea}>
        <TouchableDebounce onPress={onPress} disabled={!categoryId || isOpening}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            {isRecommended && !isSubscribed && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>{'Rekomenduojama'}</Text>
              </View>
            )}
          </View>
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
      <TouchableDebounce style={styles.right} onPress={() => onToggle(!isSubscribed)}>
        <Text style={styles.label}>{isSubscribed ? 'Sekate' : 'Sekti'}</Text>
        {isSubscribed ? (
          <IconCheckCircle size={28} color={colors.iconActive} />
        ) : (
          <IconPlusCircle size={28} color={colors.iconInactive} />
        )}
      </TouchableDebounce>
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
  titleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    flexWrap: 'wrap' as const,
  },
  title: {
    fontSize: 16,
  },
  recommendedBadge: {
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: '#FFC10722',
  },
  recommendedText: {
    fontSize: 12,
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
