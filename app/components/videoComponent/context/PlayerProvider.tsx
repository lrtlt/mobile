import React, {useCallback, useMemo, useState} from 'react';
import {MediaBaseData, PlayerContext, PlayerContextType} from './PlayerContext';
import {useTheme} from '../../../Theme';
import MiniPlayerAudio from './miniPlayerAudio/MiniPlayerAudio';
import {View} from 'react-native';
import {Playlist} from './playlist/Playlist';

const PlayerProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [currentMedia, setCurrentMedia] = useState<MediaBaseData>();
  const [playlist, setPlaylist] = useState<Playlist>();

  const {colors} = useTheme();

  const handleClose = useCallback(() => {
    setCurrentMedia(undefined);
    setPlaylist(undefined);
  }, []);

  const handleNext = useCallback(() => {
    if (playlist) {
      if (playlist.next()) {
        playlist.load().then((data) => {
          if (data) {
            setCurrentMedia(data);
          }
        });
      }
    }
  }, [playlist]);

  const handlePrevious = useCallback(() => {
    if (playlist) {
      if (playlist.previous()) {
        playlist.load().then((data) => {
          if (data) {
            setCurrentMedia(data);
          }
        });
      }
    }
  }, [playlist]);

  const handleEnded = useCallback(() => {
    if (playlist) {
      handleNext();
    } else {
      handleClose();
    }
  }, [playlist]);

  const renderMiniPlayer = useCallback(() => {
    if (!currentMedia) {
      return null;
    }
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
        <MiniPlayerAudio
          onEnded={handleEnded}
          onNext={playlist ? handleNext : undefined}
          onPrevious={playlist ? handlePrevious : undefined}
        />
      </View>
    );
  }, [colors, currentMedia, playlist]);

  const context: PlayerContextType = useMemo(
    () => ({
      mediaData: currentMedia,
      setMediaData: (data: MediaBaseData) => {
        console.log('setMediaData', data);
        setPlaylist(undefined);
        setCurrentMedia(data);
      },
      setPlaylist: (playlist: Playlist) => {
        console.log('setPlaylist', playlist);
        setPlaylist(playlist);
        playlist.load().then((data) => {
          if (data) {
            setCurrentMedia(data);
          }
        });
      },
      close: handleClose,
    }),
    [currentMedia, playlist, setCurrentMedia, setPlaylist, handleClose],
  );

  return (
    <PlayerContext.Provider value={context}>
      {props.children}
      {renderMiniPlayer()}
    </PlayerContext.Provider>
  );
};

export default PlayerProvider;
