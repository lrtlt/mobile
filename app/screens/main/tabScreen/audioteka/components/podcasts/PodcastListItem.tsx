import React, {useCallback} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Podcast} from '../../../../../../api/Types';
import Image from 'react-native-fast-image';
import {Text, TouchableDebounce} from '../../../../../../components';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../../../../../navigation/MainStack';

interface Props {
  style?: ViewStyle;
  podcast: Podcast;
}

const PodcastListItem: React.FC<Props> = ({style, podcast}) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  const onPressHandler = useCallback(() => {
    navigation.navigate('Category', {
      id: podcast.category_id,
      name: podcast.title,
    });
  }, [podcast]);

  return (
    <TouchableDebounce debounceTime={500} onPress={onPressHandler}>
      <View style={{...styles.container, ...style}}>
        <Image
          style={styles.image}
          source={{
            uri: podcast.backgroundImage,
          }}
        />
        <LinearGradient
          style={StyleSheet.absoluteFillObject}
          colors={['#000000', '#00000066', '#00000000']}
          useAngle={true}
          angle={0}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{podcast.title}</Text>
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default PodcastListItem;

const styles = StyleSheet.create({
  container: {
    width: 300,
    aspectRatio: 271 / 406,
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 20,
    color: 'white',
  },
});
