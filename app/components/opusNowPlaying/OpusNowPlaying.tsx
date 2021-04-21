import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {IconNote} from '../svg';
import firestore from '@react-native-firebase/firestore';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import Text from '../text/Text';
import {useNavigation} from '@react-navigation/core';
import OpusPlaylistModal from '../opusPlaylistModal/OpusPlaylistModal';

const OpusNowComponent: React.FC = () => {
  const [currentSong, setCurrentSong] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const {colors, strings} = useTheme();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection<any>('rds')
      .doc('opus')
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot) {
          const {info} = documentSnapshot.data();
          setCurrentSong(info);
        } else {
          console.warn('documentSnapshot is null from firestore');
        }
      });
    return unsubscribe;
  }, []);

  const previousSongsPressHandler = useCallback(() => {
    setModalVisible(true);
  }, []);

  const cancelModalHandler = useCallback(() => {
    setModalVisible(false);
  }, []);

  console.log('currectsong', currentSong);
  return (
    <>
      <View>
        <View style={{...styles.container, backgroundColor: 'rgba(242,177,46,.3)'}}>
          <TextComponent style={styles.title}>Eteryje</TextComponent>
          <TextComponent style={styles.song}>{currentSong.replace('Eteryje: ', '')}</TextComponent>
          <TouchableOpacity onPress={previousSongsPressHandler}>
            <View style={{...styles.previousSongsButton, backgroundColor: 'rgba(242,177,46,.3)'}}>
              <View style={styles.iconContainer}>
                <IconNote size={12} color={colors.text} />
              </View>
              <Text style={styles.previousSongsButtonText}>{strings.previous_songs}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <OpusPlaylistModal visible={modalVisible} currentSong={currentSong} onCancel={cancelModalHandler} />
    </>
  );
};

export default OpusNowComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    paddingVertical: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 15,
  },
  song: {
    flex: 1,
    marginVertical: 8,
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 14,
  },
  previousSongsButton: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  previousSongsButtonText: {
    textAlign: 'center',
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 16,
  },
});
