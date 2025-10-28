import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import TextComponent from '../../components/text/Text';
import Modal from 'react-native-modal';
import {useTheme} from '../../Theme';
import {TouchableDebounce} from '../../components';

interface Props {
  title: string;
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  return (
    <Modal
      style={styles.modal}
      isVisible={props.visible}
      avoidKeyboard={true}
      useNativeDriver={true}
      coverScreen={true}
      backdropOpacity={0.6}
      onBackdropPress={props.onCancel}
      onBackButtonPress={props.onCancel}>
      <View style={{...styles.modalContentContainer, backgroundColor: colors.background}}>
        <TextComponent style={styles.titleText} fontFamily="PlayfairDisplay-Regular">
          {props.title}
        </TextComponent>
        <View style={styles.row}>
          <TouchableDebounce
            style={{
              ...styles.button,
              borderColor: colors.buttonBorder,
              backgroundColor: colors.primary,
            }}
            onPress={props.onConfirm}>
            <TextComponent style={{...styles.buttonText, color: colors.onPrimary}}>Taip</TextComponent>
          </TouchableDebounce>
          <TouchableDebounce
            style={{...styles.button, borderColor: colors.buttonBorder}}
            onPress={props.onCancel}>
            <TextComponent style={styles.buttonText}>Ne</TextComponent>
          </TouchableDebounce>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentContainer: {
    minWidth: '50%',
    maxWidth: '80%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 16,
  },
  titleText: {
    fontSize: 19,
    width: '100%',
    textAlign: 'center',
  },

  button: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontSize: 16,
  },
});
