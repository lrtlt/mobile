import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import TextComponent from '../../components/text/Text';
import Modal from 'react-native-modal';
import {useTheme} from '../../Theme';
import {Button} from '../../components';

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<Props> = (props) => {
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
        <TextComponent style={styles.titleText}>Įsiminti?</TextComponent>
        <View style={styles.row}>
          <Button style={{...styles.button, borderColor: colors.buttonBorder}} onPress={props.onCancel}>
            <TextComponent style={styles.buttonText}>Ne</TextComponent>
          </Button>
          <View style={styles.buttonSparator} />
          <Button
            style={{
              ...styles.button,
              borderColor: colors.buttonBorder,
              backgroundColor: colors.primary,
            }}
            onPress={props.onConfirm}>
            <TextComponent style={{...styles.buttonText, color: colors.onPrimary}}>Taip</TextComponent>
          </Button>
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
    maxWidth: '80%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    marginTop: 16,
  },
  titleText: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 20,
    width: '100%',
    textAlign: 'center',
  },
  buttonSparator: {
    width: 16,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
});
