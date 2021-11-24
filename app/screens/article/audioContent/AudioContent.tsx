import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Image from 'react-native-fast-image';
import {useTheme} from '../../../Theme';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';
import {Text} from '../../../components';
import ArticleParagraph from '../../../components/articleParagraphs/paragraph/ArticleParagraph';

interface AudioContentProps {
  about_episode: string;
  about_show?: string;
  image?: {
    path: string;
    w_h: string;
  };
}

type ContentType = 'episode' | 'show';

const AudioContent: React.FC<AudioContentProps> = ({about_episode, about_show, image}) => {
  const [selectedContent, setSelectedContent] = useState<ContentType>('episode');
  const {colors, strings} = useTheme();
  const onEpisodePressHandler = useCallback(() => {
    setSelectedContent('episode');
  }, []);

  const onShowPressHandler = useCallback(() => {
    setSelectedContent('show');
  }, []);

  console.log('selected: ', selectedContent);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity onPress={onEpisodePressHandler}>
          <Text
            style={{
              ...styles.textTitle,
              color: selectedContent === 'episode' ? colors.text : colors.textSecondary,
            }}
            fontFamily={selectedContent === 'episode' ? 'SourceSansPro-SemiBold' : 'SourceSansPro-Regular'}>
            {strings.about_episode}
          </Text>
        </TouchableOpacity>
        {about_show && (
          <TouchableOpacity style={styles.aboutShowTextContainer} onPress={onShowPressHandler}>
            <Text
              style={{
                ...styles.textTitle,
                color: selectedContent === 'show' ? colors.text : colors.textSecondary,
              }}
              fontFamily={selectedContent === 'show' ? 'SourceSansPro-SemiBold' : 'SourceSansPro-Regular'}>
              {strings.about_show}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {selectedContent === 'show' && image && (
        <View style={styles.imageContainer}>
          <Image
            style={{...styles.image, aspectRatio: Number(image.w_h)}}
            source={{
              uri: buildArticleImageUri(IMG_SIZE_M, image.path),
            }}
          />
        </View>
      )}
      <ArticleParagraph htmlText={selectedContent === 'episode' ? about_episode : about_show} />
    </View>
  );
};

export default AudioContent;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  textTitle: {
    fontSize: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 130,
    maxHeight: 170,
  },
  aboutShowTextContainer: {
    marginLeft: 32,
  },
});
