import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {FacebookReactions, Text, TouchableDebounce} from '../../../components';
import {useTheme} from '../../../Theme';
import {IconVolume} from '../../../components/svg';
import {checkEqual} from '../../../util/LodashEqualityCheck';

interface Props {
  category: string;
  date?: string;
  title: string;
  subtitle?: string;
  facebookReactions?: string;
  author: string;

  //Text 2 speech params. Maybe move it elsewhere later on?
  text2SpeechEnabled: boolean;
  isText2SpeechPlaying: boolean;
  onPlayStateChange: (play: boolean) => void;
}

const ArticleHeader: React.FC<Props> = ({
  author,
  category,
  title,
  date,
  facebookReactions,
  subtitle,
  text2SpeechEnabled,
  isText2SpeechPlaying,
  onPlayStateChange,
}) => {
  const {colors} = useTheme();

  const text2SpeechPlayHander = useCallback(() => {
    onPlayStateChange(!isText2SpeechPlaying);
  }, [isText2SpeechPlaying, onPlayStateChange]);

  const text2SpeechComponent = text2SpeechEnabled ? (
    <TouchableDebounce style={styles.text2SpeechContainer} onPress={text2SpeechPlayHander}>
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
      <Text style={styles.titleText} selectable={true}>
        {title}
      </Text>
      {subtitleComponent}
      {facebookReactionsComponent}

      <View style={styles.authorShareContainer}>
        <View style={styles.authorContainer}>
          <Text style={styles.smallTextBold}>{author}</Text>
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
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
  },
  smallTextBold: {
    fontFamily: 'SourceSansPro-SemiBold',
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
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 25,
  },
  subtitle: {
    fontFamily: 'SourceSansPro-Regular',
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
