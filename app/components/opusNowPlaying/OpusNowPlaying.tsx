import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {IconNote} from '../svg';
import firestore from '@react-native-firebase/firestore';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import Text from '../text/Text';
import OpusPlaylistModal from '../opusPlaylistModal/OpusPlaylistModal';
import {TouchableOpacity} from 'react-native-gesture-handler';

const OPUS_COLOR = 'rgba(242,177,46,.3)';

const OpusNowComponent: React.FC = () => {
  const [currentSong, setCurrentSong] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const {colors, strings} = useTheme();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection<any>('rds')
      .doc('opus')
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot) {
          try {
            const {info} = documentSnapshot.data();
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
    borderRadius: 8,
    marginTop: 8,
  },
  previousSongsButtonText: {
    textAlign: 'center',

    fontSize: 16,
  },
});
