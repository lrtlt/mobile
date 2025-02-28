import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Genre} from '../../../../../../api/Types';
import Text from '../../../../../../components/text/Text';
import {useTheme} from '../../../../../../Theme';

import {TouchableDebounce} from '../../../../../../components';

interface Props {
  data: Genre[];
  title?: string;
  onPress: (genreId: number, genreTitle: string) => void;
}

const RadiotekaGenres: React.FC<React.PropsWithChildren<Props>> = ({data, title, onPress}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.title} fontFamily="SourceSansPro-SemiBold">
        {title}
      </Text>

      <View style={styles.genresContainer}>
        {data.map((genre) => (
          <TouchableDebounce
            key={genre.genre_id}
            style={[
              styles.genreButton,
              {
                backgroundColor: colors.background,
              },
            ]}
            onPress={() => onPress(genre.genre_id, genre.genre_title)}>
            <Text style={styles.genreText} fontFamily="SourceSansPro-SemiBold">
              {genre.genre_title}
            </Text>
          </TouchableDebounce>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 24,
    paddingBottom: 72,
  },
  title: {
    fontSize: 20,
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 16,
  },
  genreButton: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreText: {
    fontSize: 13.5,
    textAlign: 'center',
  },
});

export default RadiotekaGenres;
