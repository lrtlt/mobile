import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {useTheme} from '../../Theme';
import {LRTArchivesIcon} from '../svg';
import Text from '../text/Text';
import TouchableDebounce from '../touchableDebounce/TouchableDebounce';

interface LRTArchivesBadgeProps {}

const LRTArchivesBadge: React.FC<LRTArchivesBadgeProps> = () => {
  const {colors} = useTheme();

  return (
    <View style={[styles.container, {backgroundColor: colors.background, borderColor: colors.border}]}>
      <LRTArchivesIcon height={30} />
      <Text type="secondary" style={[styles.description, {color: colors.textSecondary}]}>
        LRT Archyvams priklausantis įrašas
      </Text>
      <TouchableDebounce
        onPress={() => {
          Linking.openURL('https://archyvai.lrt.lt/paveldas');
        }}>
        <Text style={[styles.link, {color: colors.tertiary}]}>Daugiau įrašų</Text>
      </TouchableDebounce>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderRadius: 8,
    padding: 12,
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  link: {
    fontSize: 14,
  },
});

export default LRTArchivesBadge;
