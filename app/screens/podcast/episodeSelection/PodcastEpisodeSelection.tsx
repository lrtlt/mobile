import {PropsWithChildren, useState} from 'react';
import useEpisodes from './useEpisodes';
import {StyleSheet, View} from 'react-native';
import {IconCarretDown} from '../../../components/svg';
import {useTheme} from '../../../Theme';
import {Text, TouchableDebounce} from '../../../components';
import PodcastEpisodesModal from './PodcastEpisodesModal';

interface Props {
  category_id?: number;
}

const PodcastEpisodeSelection: React.FC<PropsWithChildren<Props>> = ({category_id}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {items} = useEpisodes(category_id);

  const {colors} = useTheme();

  if (!category_id) {
    return null;
  }

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
      <PodcastEpisodesModal episodes={items} visible={modalVisible} onClose={() => setModalVisible(false)} />
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
