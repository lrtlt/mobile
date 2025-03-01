import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {FacebookReactions, Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {IconVolume} from '../../../components/svg';
import {checkEqual} from '../../../util/LodashEqualityCheck';
import {useMediaPlayer} from '../../../components/videoComponent/context/useMediaPlayer';
import {MediaType} from '../../../components/videoComponent/context/PlayerContext';

interface Props {
  category: string;
  date?: string;
  title: string;
  subtitle?: string;
  image?: string;
  facebookReactions?: string;
  author: string;
  text2SpeechUrl?: string;
}

const ArticleHeader: React.FC<React.PropsWithChildren<Props>> = ({
  author,
  category,
  title,
  date,
  facebookReactions,
  image,
  subtitle,
  text2SpeechUrl,
}) => {
  const {colors} = useTheme();

  const {setMediaData, mediaData, close} = useMediaPlayer();
  const isText2SpeechPlaying = mediaData?.uri === text2SpeechUrl;

  const text2SpeechPlayHander = useCallback(() => {
    if (isText2SpeechPlaying) {
      close();
    } else {
      setMediaData({
        isLiveStream: false,
        mediaType: MediaType.AUDIO,
        title: title,
        uri: text2SpeechUrl!,
        poster: image,
      });
    }
  }, [isText2SpeechPlaying]);

  const text2SpeechComponent = Boolean(text2SpeechUrl) ? (
    <TouchableDebounce
      style={styles.text2SpeechContainer}
      onPress={text2SpeechPlayHander}
      accessibilityLabel="Skaityti straipsnį garsu"
      accessibilityLanguage="lt">
      <View
        style={{
          ...styles.iconButton,
          borderColor: colors.buttonBorder,
          backgroundColor: isText2SpeechPlaying ? colors.primary : undefined,
        }}>
        <IconVolume size={22} color={isText2SpeechPlaying ? colors.onPrimary : colors.buttonContent} />
      </View>
    </TouchableDebounce>
  ) : null;

  const subtitleComponent = subtitle ? (
    <Text style={styles.subtitle} type="error">
      {subtitle}
    </Text>
  ) : null;

  const facebookReactionsComponent = facebookReactions ? (
    <FacebookReactions style={styles.facebookReactions} count={facebookReactions} />
  ) : null;

  return (
    <View style={styles.root}>
      <View style={styles.categoryContainer}>
        <Text style={styles.smallText}>{category}</Text>
        <View style={{...styles.greyDot, backgroundColor: colors.buttonContent}} />
        <Text style={styles.smallText}>{date}</Text>
      </View>
      <Text style={styles.titleText} selectable={true} fontFamily="PlayfairDisplay-Regular">
        {title}
      </Text>
      {subtitleComponent}
      {facebookReactionsComponent}

      <View style={styles.authorShareContainer}>
        <View style={styles.authorContainer}>
          <Text style={styles.smallTextBold} fontFamily="SourceSansPro-SemiBold">
            {author}
          </Text>
        </View>
        {text2SpeechComponent}
      </View>
    </View>
  );
};

export default React.memo(ArticleHeader, (prevProps, nextProps) => checkEqual(prevProps, nextProps));

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  categoryContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 32,
    flexDirection: 'row',
  },
  facebookReactions: {
    marginTop: 8,
  },
  smallText: {
    fontSize: 14,
  },
  smallTextBold: {
    fontSize: 14,
  },
  authorShareContainer: {
    flex: 1,
    paddingBottom: 16,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  greyDot: {
    width: 4,
    height: 4,
    marginStart: 8,
    marginEnd: 8,
    marginTop: 2,
    borderRadius: 2,
  },
  titleText: {
    marginTop: 24,
    fontSize: 25,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
  },
  iconButton: {
    padding: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  text2SpeechContainer: {
    alignSelf: 'flex-end',
  },
});
