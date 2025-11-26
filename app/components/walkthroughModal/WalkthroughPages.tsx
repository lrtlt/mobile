import React, {PropsWithChildren} from 'react';
import {Image, View, StyleSheet} from 'react-native';
import Text from '../text/Text';
import {useTheme} from '../../Theme';

// Placeholder images - User needs to add these to assets
const image1 = require('../../../assets/img/walkthrough_01.png');
const image2 = require('../../../assets/img/walkthrough_02.png');
const image3 = require('../../../assets/img/walkthrough_03.png');
const image4 = require('../../../assets/img/walkthrough_04.png');

export const Page1: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      image={image1}
      title="Jūsų asmeninė LRT.lt paskyra"
      text="Prisijunkite ir valdykite savo naujienų srautą bei nustatymus asmeniškai."
    />
  );
};

export const Page2: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      image={image2}
      title="Pranešimai jūsų telefone"
      text="Gaukite svarbiausias naujienas ir suasmenintus pranešimus tiesiai į telefoną."
    />
  );
};

export const Page3: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      image={image3}
      title="Pasiekiama visuose įrenginiuose"
      text="Jūsų nustatymai ir išsaugotas turinys keliauja su jumis – pradėkite telefone, tęskite planšetėje ar kompiuteryje."
    />
  );
};

export const Page4: React.FC<PropsWithChildren<{}>> = () => {
  return (
    <ImageTextPage
      image={image4}
      title="Pasiekiama visuose įrenginiuose"
      text="Jūsų nustatymai ir išsaugotas turinys keliauja su jumis – pradėkite telefone, tęskite planšetėje ar kompiuteryje."
    />
  );
};

const ImageTextPage: React.FC<
  PropsWithChildren<{
    title: string;
    text: string;
    image: any;
  }>
> = ({title, text, image}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
        <Text style={[styles.text, {color: colors.textSecondary}]}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  imageContainer: {
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 16,
    gap: 8,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
  },
});
