import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import Modal from 'react-native-modal';
import {ProgramDay} from '../../components';
import Divider from '../../components/divider/Divider';
import {useTheme} from '../../Theme';

interface Props {
  visible: boolean;
  days: any[];
  onDateSelected: (index: number) => void;
  onCancel: () => void;
}

const ProgramDateModal: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  return (
    <Modal
      style={styles.modal}
      isVisible={props.visible}
      avoidKeyboard={true}
      useNativeDriver={true}
      coverScreen={true}
      backdropOpacity={0.7}
      onBackdropPress={props.onCancel}
      onBackButtonPress={props.onCancel}>
      <View style={{...styles.modalContent, backgroundColor: colors.greyBackground}}>
        {props.days.map((day: string, index: number) => (
          <TouchableOpacity
            key={day}
            onPress={() => {
              props.onDateSelected(index);
            }}>
            <ProgramDay style={styles.dayListItem} dateString={day} />
            {index !== props.days.length - 1 ? <Divider /> : null}
          </TouchableOpacity>
        ))}
      </View>
    </Modal>
  );
};

export default ProgramDateModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    minWidth: 280,
    borderRadius: 8,
  },
  dayListItem: {
    padding: 22,
    justifyContent: 'center',
  },
});
