import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {IconNote} from '../svg';
import firestore from '@react-native-firebase/firestore';
import TextComponent from '../text/Text';
import {useTheme} from '../../Theme';

const OpusNowComponent = (props) => {
  const [currentSong, setCurrentSong] = useState('');

  const {colors} = useTheme();

  useEffect(() => {
    const subscriber = firestore()
      .collection('rds')
      .doc('opus')
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot != null) {
          const {info} = documentSnapshot.data();
          setCurrentSong(info);
        } else {
          console.warn('documentSnapshot is null from firestore');
        }
      });
    return () => subscriber();
  }, []);

  console.log('currectsong', currentSong);
  return (
    <View>
      <View style={{...styles.container, backgroundColor: colors.primaryLightest}}>
        <View style={styles.iconContainer}>
          <View style={{...styles.iconButton, backgroundColor: colors.lightGreyBackground}}>
            <IconNote size={12} color={colors.darkIcon} />
          </View>
        </View>
        <TextComponent style={styles.title}>{currentSong}</TextComponent>
      </View>
    </View>
  );
};

export default OpusNowComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    padding: 4,
    paddingStart: 8,
    paddingEnd: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  title: {
    flex: 1,
    padding: 4,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 13,
  },
});
