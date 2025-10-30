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

const PleaseLoginModal: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  return (
    <Modal
      style={styles.modal}
      isVisible={props.visible}
      coverScreen={true}
      backdropOpacity={0.7}
      backdropTransitionInTiming={400}
      backdropTransitionOutTiming={400}
      statusBarTranslucent={true}
      onBackdropPress={props.onCancel}
      onBackButtonPress={props.onCancel}>
      <View style={{...styles.modalContentContainer, backgroundColor: colors.background}}>
        <TextComponent style={styles.titleText} fontFamily="SourceSansPro-SemiBold">
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
            <TextComponent style={{...styles.buttonText, color: colors.onPrimary}}>Prisijungti</TextComponent>
          </TouchableDebounce>
          <TouchableDebounce
            style={{...styles.button, borderColor: colors.buttonBorder}}
            onPress={props.onCancel}>
            <TextComponent style={styles.buttonText}>Uždaryti</TextComponent>
          </TouchableDebounce>
        </View>
      </View>
    </Modal>
  );
};

export default PleaseLoginModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentContainer: {
    minWidth: '50%',
    maxWidth: '80%',
    alignItems: 'center',
    padding: 22,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  titleText: {
    fontSize: 19,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
  },
});
