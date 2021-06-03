import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fetchOpusPlaylist} from '../../api';
import {OpusPlayListItem} from '../../api/Types';
import {useTheme} from '../../Theme';
import {IconClose} from '../svg';
import Text from '../text/Text';
import OpusPaylistList from './OpusPlaylistList';

interface OpusPlaylistModalProps {
  visible: boolean;
  currentSong: string;

  onCancel: () => void;
}

const OpusPlaylistModal: React.FC<OpusPlaylistModalProps> = ({visible, currentSong, onCancel}) => {
  const [items, setItems] = useState<OpusPlayListItem[]>([]);

  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      fetchOpusPlaylist().then((response) => setItems(response.rds));
    }
  }, [visible]);

  return (
    <Modal
      style={{
        ...styles.modal,
        backgroundColor: colors.slugBackground,
        marginTop: insets.top + 16,
        marginLeft: insets.left + 16,
        marginRight: insets.right + 16,
        marginBottom: insets.bottom + 16,
      }}
      isVisible={visible}
      useNativeDriver={false}
      coverScreen={true}
      backdropOpacity={0.8}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}>
      <View style={styles.flex}>
        <TouchableOpacity style={{...styles.closeButton, borderColor: colors.border}} onPress={onCancel}>
          <View style={styles.closeButtonContainer}>
            <IconClose size={8} color={colors.textSecondary} />
            <Text style={styles.closeText} type="secondary">
              Uždaryti
            </Text>
          </View>
        </TouchableOpacity>
        <OpusPaylistList items={items} currentSong={currentSong} />
      </View>
    </Modal>
  );
};

export default OpusPlaylistModal;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  modal: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
  },
  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 4,
    borderWidth: 1,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
    marginStart: 8,
  },
});
