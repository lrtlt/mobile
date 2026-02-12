import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';
import Text from '../text/Text';
import OpusPlaylistModal from '../opusPlaylistModal/OpusPlaylistModal';

interface Props {
  channelId?: number;
}

const getRDSDocId = (channelId?: number) => {
  switch (channelId) {
    case 4:
      // return 'rds/radijas';
      return null;
    case 5:
      return 'rds/klasika';
    case 6:
      return 'rds/opus';
    case 37:
      return 'rds/lrt100';
    default:
      return null;
  }
};
const NowComponent: React.FC<React.PropsWithChildren<Props>> = ({channelId}) => {
  const [currentSong, setCurrentSong] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const {colors, strings} = useTheme();

  const docId = getRDSDocId(channelId);

  useEffect(() => {
    if (!docId) {
      return;
    }

    const db = getFirestore();
    const doc = db.doc(docId);
    const unsubscribe = onSnapshot<any>(doc, {
      next(snapshot) {
        try {
          const {info} = snapshot.data() as any;

          setCurrentSong(info);
        } catch (e) {
          console.log(e);
        }
      },
      error(error) {
        console.warn('Error fetching Opus now playing data:', error);
        setCurrentSong('-');
      },
    });
    return unsubscribe;
  }, [docId]);

  const previousSongsPressHandler = useCallback(() => {
    setModalVisible(true);
  }, []);

  const cancelModalHandler = useCallback(() => {
    setModalVisible(false);
  }, []);

  if (!docId) {
    return null;
  }

  return (
    <>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 24, paddingBottom: 12}}>
        <View style={{...styles.verticalDivider, backgroundColor: colors.listSeparator}} />
        <View style={styles.container}>
          <TextComponent style={styles.title} type="secondary">
            Eteryje klausote
          </TextComponent>
          <TextComponent style={styles.song}>{currentSong.replace('Eteryje: ', '')}</TextComponent>
          <TouchableOpacity style={styles.previousSongsButton} onPress={previousSongsPressHandler}>
            <Text style={{...styles.previousSongsButtonText, color: colors.tertiary}}>
              {strings.previous_songs}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <OpusPlaylistModal visible={modalVisible} currentSong={currentSong} onCancel={cancelModalHandler} />
    </>
  );
};

export default NowComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  verticalDivider: {
    width: 3,
    height: '100%',
  },
  title: {
    fontSize: 13,
  },
  song: {
    flex: 1,
    marginVertical: 2,
    paddingEnd: 24,
    fontSize: 14,
  },
  previousSongsButton: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 8,
    paddingLeft: 0,
  },
  previousSongsButtonText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
