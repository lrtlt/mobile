import React from 'react';
import {View, StyleSheet} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import {useTheme} from '../../Theme';
import TextComponent from '../text/Text';

interface Props {
  onAccept: () => void;
  onDecline: () => void;
}
const AdultContentWarningComponent: React.FC<Props> = ({onAccept, onDecline}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TextComponent style={{...styles.textBadge, borderColor: colors.buttonBorder}}>N-18</TextComponent>
        <TextComponent style={styles.title}>DĖMESIO!</TextComponent>
      </View>
      <TextComponent style={styles.text} fontFamily="PlayfairDisplay-Regular">
        {'Čia pateikiama informacija skirta asmenims nuo'}{' '}
        {<TextComponent type="error">18 metų</TextComponent>}
      </TextComponent>
      <View style={styles.buttonRow}>
        <RectButton
          style={styles.button}
          rippleColor={colors.ripple}
          underlayColor={colors.primary}
          onPress={onAccept}>
          <View style={styles.buttonPositive}>
            <TextComponent style={styles.buttonPositiveText} fontFamily="SourceSansPro-SemiBold">
              MAN JAU YRA 18 METŲ
            </TextComponent>
          </View>
        </RectButton>
        <View style={styles.buttonSpace} />
        <RectButton
          style={styles.button}
          rippleColor={colors.ripple}
          underlayColor={colors.primary}
          onPress={onDecline}>
          <View style={styles.buttonNegative}>
            <TextComponent style={styles.buttonNegativeText} fontFamily="SourceSansPro-SemiBold">
              MAN DAR NĖRA 18 METŲ
            </TextComponent>
          </View>
        </RectButton>
      </View>
    </View>
  );
};

export default AdultContentWarningComponent;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
  },
  textBadge: {
    borderWidth: 1,
    padding: 4,
    fontSize: 14,

    borderRadius: 4,
  },
  title: {
    padding: 4,
    fontSize: 22,
    marginLeft: 4,
  },
  text: {
    marginTop: 8,
    fontSize: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'column',
    marginTop: 16,
  },
  buttonSpace: {
    width: 8,
  },
  button: {
    marginTop: 8,
  },
  buttonPositive: {
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#45a2ff',
  },
  buttonPositiveText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  buttonNegativeText: {
    fontSize: 14,
    color: '#45a2ff',
  },
  buttonNegative: {
    padding: 14,
    alignItems: 'center',
  },
});
