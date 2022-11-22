import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {fetchOpusPlaylist} from '../../api';
import {OpusPlayListItem} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
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

  const cancellablePromise = useCancellablePromise();

  useEffect(() => {
    if (visible) {
      cancellablePromise(fetchOpusPlaylist()).then((response) => setItems(response.rds));
    }
  }, [cancellablePromise, visible]);

  return (
    <Modal
      style={{
        ...styles.modal,
        // backgroundColor: colors.slugBackground,
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
    paddingTop: 12,
  },
  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 99,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 14,
    marginStart: 8,
  },
});
