import {PropsWithChildren, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconCarretDown} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import {Text, TouchableDebounce} from '../../../components';
import PodcastEpisodesModal from './PodcastEpisodesModal';
import {ArticleCategoryInfo, ArticleSeasonInfo} from '../../../api/Types';

interface Props {
  currentSeason?: ArticleSeasonInfo;
  categoryInfo?: ArticleCategoryInfo;
}

const PodcastEpisodeSelection: React.FC<PropsWithChildren<Props>> = ({categoryInfo, currentSeason}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {colors} = useTheme();

  const seasons = useMemo(
    () =>
      categoryInfo?.season_info.sort((a, b) => {
        if (a.lrt_season_count > b.lrt_season_count) {
          return -1;
        }
        if (a.lrt_season_count < b.lrt_season_count) {
          return 1;
        }
        return 0;
      }),
    [categoryInfo],
  );

  return (
    <TouchableDebounce
      style={[styles.root, {backgroundColor: colors.tabBarBackground}]}
      onPress={() => {
        setModalVisible(!modalVisible);
      }}>
      <View>
        <Text style={styles.caption} type="secondary">
          Epizodas
        </Text>
        <Text style={styles.caption}>Pasirinkite</Text>
      </View>
      {modalVisible ? (
        <View style={{transform: [{rotate: '180deg'}]}}>
          <IconCarretDown size={16} color={colors.primary} />
        </View>
      ) : (
        <IconCarretDown size={16} color={colors.primary} />
      )}
      {seasons && (
        <PodcastEpisodesModal
          seasons={seasons}
          currentSeason={currentSeason}
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </TouchableDebounce>
  );
};

export default PodcastEpisodeSelection;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caption: {
    fontSize: 13,
  },
});
