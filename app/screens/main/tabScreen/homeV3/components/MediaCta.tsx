import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../../../../components';
import {IconPlay} from '../../../../../components/svg';
import {MediaKind} from '../util';

export type PlayColors = {
  background: string;
  foreground: string;
};

export type MediaAccent = PlayColors & {
  label: string;
};

/** Accent of each media shelf on lrt.lt: Mediateka blue, Radioteka yellow, Epika green. */
export const MEDIA_ACCENTS: Record<MediaKind, MediaAccent> = {
  video: {background: '#4258FF', foreground: '#FFFFFF', label: 'Žiūrėti'},
  audio: {background: '#F7D046', foreground: '#02030D', label: 'Klausyti'},
  epika: {background: '#56EA52', foreground: '#02030D', label: 'Žiūrėti'},
};

interface Props {
  accent: MediaAccent;
}

/** "▶ Žiūrėti" / "▶ Klausyti" button in the bottom left corner of a media image. */
const MediaCta: React.FC<Props> = ({accent}) => (
  <View
    style={{...styles.container, backgroundColor: accent.background}}
    importantForAccessibility="no-hide-descendants">
    <View style={styles.icon}>
      <IconPlay size={10} color={accent.foreground} />
    </View>
    <Text style={{...styles.text, color: accent.foreground}} scalingEnabled={false}>
      {accent.label}
    </Text>
  </View>
);

export default MediaCta;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    height: 32,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 12,
  },
});
