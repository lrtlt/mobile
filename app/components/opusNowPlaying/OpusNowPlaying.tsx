import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {IconNote} from '../svg';
import {collection, getFirestore} from '@react-native-firebase/firestore';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import Text from '../text/Text';
import OpusPlaylistModal from '../opusPlaylistModal/OpusPlaylistModal';

const OPUS_COLOR = 'rgba(240,81,35,.3)';

const OpusNowComponent: React.FC<React.PropsWithChildren<{}>> = () => {
  const [currentSong, setCurrentSong] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const {colors, strings} = useTheme();

  useEffect(() => {
    const unsubscribe = collection(getFirestore(), 'rds')
      .doc('opus')
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot) {
          try {
            const {info} = documentSnapshot.data() as any;
            setCurrentSong(info);
          } catch (e) {
            console.log(e);
          }
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
        <View style={{...styles.container, backgroundColor: OPUS_COLOR}}>
          <TextComponent style={styles.title} fontFamily="SourceSansPro-SemiBold">
            Eteryje
          </TextComponent>
          <TextComponent style={styles.song}>{currentSong.replace('Eteryje: ', '')}</TextComponent>
          <TouchableOpacity onPress={previousSongsPressHandler}>
            <View style={{...styles.previousSongsButton, backgroundColor: OPUS_COLOR}}>
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
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
  },
  song: {
    flex: 1,
    marginVertical: 8,
    fontSize: 14,
  },
  previousSongsButton: {
    width: '100%',
    minWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 4,
    marginTop: 4,
  },
  previousSongsButtonText: {
    textAlign: 'center',

    fontSize: 16,
  },
});
