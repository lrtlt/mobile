import {StyleSheet, View} from 'react-native';
import {Text} from '../../../components';

const SimpleDisclaimer: React.FC<React.PropsWithChildren> = () => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.title} fontFamily="SourceSansPro-SemiBold">
        LRT Paprastai
      </Text>
      <Text style={styles.text}>
        LRT Paprastai – specialus žurnalistų parengtas turinys, skirtas skaitymo ir teksto suvokimo problemų
        turintiems žmonėms. Taip parengta informacija tinkama intelekto negalią turintiems asmenims, vaikams,
        senjorams, taip pat lietuvių kalbos besimokantiems užsieniečiams.
      </Text>
    </View>
  );
};

export default SimpleDisclaimer;

const styles = StyleSheet.create({
  textContainer: {
    gap: 16,
  },
  title: {
    fontSize: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
  },
});
