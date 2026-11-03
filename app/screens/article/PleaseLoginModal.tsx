import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import TextComponent from '../../components/text/Text';
import BaseModal from '../../components/baseModal/BaseModal';
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
    <BaseModal
      style={styles.modal}
      isVisible={props.visible}
      backdropOpacity={0.7}
      statusBarTranslucent={true}
      onBackdropPress={props.onCancel}
      onBackButtonPress={props.onCancel}>
      <View style={{...styles.modalContentContainer, backgroundColor: colors.background}}>
        <TextComponent style={styles.titleText}>{props.title}</TextComponent>
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
    </BaseModal>
  );
};

export default PleaseLoginModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContentContainer: {
    minWidth: '60%',
    maxWidth: '90%',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 16,
  },
  titleText: {
    fontSize: 19,
    lineHeight: 30,
    textAlign: 'center',
  },
  button: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 17,
  },
});
