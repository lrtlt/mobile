import React, {useCallback, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ArticleParagraph, Text} from '../../../components';
import Image from 'react-native-fast-image';
import {useTheme} from '../../../Theme';
import {buildArticleImageUri, IMG_SIZE_M} from '../../../util/ImageUtil';

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
              ...(selectedContent === 'episode' ? styles.textTitleSelected : styles.textTitle),
              color: selectedContent === 'episode' ? colors.text : colors.textSecondary,
            }}>
            {strings.about_episode}
          </Text>
        </TouchableOpacity>
        {about_show && (
          <>
            <View style={{width: 32}} />
            <TouchableOpacity onPress={onShowPressHandler}>
              <Text
                style={{
                  ...(selectedContent === 'show' ? styles.textTitleSelected : styles.textTitle),
                  color: selectedContent === 'show' ? colors.text : colors.textSecondary,
                }}>
                {strings.about_show}
              </Text>
            </TouchableOpacity>
          </>
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
      <ArticleParagraph
        data={{
          p: selectedContent === 'episode' ? about_episode : about_show,
        }}
      />
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
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 20,
  },
  textTitleSelected: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 130,
    maxHeight: 200,
    borderRadius: 8,
  },
});