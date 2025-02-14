import {PropsWithChildren, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {IconCarretDown} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import {Text, TouchableDebounce} from '../../../components';
import PodcastEpisodesModal from './PodcastEpisodesModal';
import {Article} from '../../../../Types';

interface Props {
  episodes: Article[];
  onPlayEpisode: (episode: Article) => void;
}

const PodcastEpisodeSelection: React.FC<PropsWithChildren<Props>> = ({episodes, onPlayEpisode}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {colors} = useTheme();

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
      <PodcastEpisodesModal
        episodes={episodes}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onPlayPress={onPlayEpisode}
      />
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
