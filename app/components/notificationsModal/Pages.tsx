import {PropsWithChildren} from 'react';
import {ColorValue, StyleSheet, View} from 'react-native';
import Text from '../text/Text';
import SettingsNotifications from '../../screens/settings/SettingsNotifications';
import {ScrollView} from 'react-native-gesture-handler';

export const Page1: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      color={'#ccc'}
      text={'Nepraleiskite aktualiju ijungdami pranešimus ir valdykite kokios temos aktualiausios jums'}
    />
  );
};

export const Page2: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <SettingsNotifications titleStyle={styles.title} cellStyle={styles.cell} />
      </ScrollView>
    </View>
  );
};
export const Page3: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      color={'#888'}
      text={'Nepraleiskite aktualiju ijungdami pranešimus ir valdykite kokios temos aktualiausios jums'}
    />
  );
};

const ImageTextPage: React.FC<PropsWithChildren<{
  color: ColorValue;
  text: string;
}>> = ({color, text}) => {
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: color, justifyContent: 'center', alignItems: 'center'}}></View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Text style={{textAlign: 'center', fontSize: 18}}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  cell: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#aaaaaa44',
  },
});
