import React from 'react';
import {View, StyleSheet, TouchableOpacity, ColorValue} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OpusPlayListItem} from '../../api/Types';
import {useTheme} from '../../Theme';
import {IconClose} from '../svg';
import Text from '../text/Text';
import ChannelPlaylistList from './ChannelPlaylistList';

interface ChannelPlaylistModalProps {
  visible: boolean;
  onCancel: () => void;
  color?: ColorValue;
  items: OpusPlayListItem[];
}

const ChannelPlaylistModal: React.FC<ChannelPlaylistModalProps> = ({visible, onCancel, items, color}) => {
  const {colors} = useTheme();
  const insets = useSafeAreaInsets();

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
        <ChannelPlaylistList items={items} color={color} />
      </View>
    </Modal>
  );
};

export default ChannelPlaylistModal;

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
