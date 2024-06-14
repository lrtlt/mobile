import {PropsWithChildren} from 'react';
import {Image, View} from 'react-native';
import Text from '../text/Text';
import SettingsNotifications from '../../screens/settings/SettingsNotifications';
import {ScrollView} from 'react-native-gesture-handler';

const image1 = require('../../../assets/img/notifications_01.jpg');
const image2 = require('../../../assets/img/notifications_02.jpg');

export const Page1: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      image={image1}
      text={'Būkite informuoti.\nĮsijunkite tuos pranešimus, kurie jums aktualiausi.'}
    />
  );
};

export const Page2: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <SettingsNotifications />
      </ScrollView>
    </View>
  );
};
export const Page3: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      image={image2}
      text={
        'Atnaujinkite temas, kurios jus domina, ir būkite tikri, kad visada gausite svarbiausią informaciją.'
      }
    />
  );
};

const ImageTextPage: React.FC<
  PropsWithChildren<{
    text: string;
    image: any;
  }>
> = ({text, image}) => {
  return (
    <View style={{flex: 1}}>
      <Image style={{flex: 1, maxWidth: '100%'}} source={image} resizeMode="cover" />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32}}>
        <Text style={{textAlign: 'center', fontSize: 18}}>{text}</Text>
      </View>
    </View>
  );
};
