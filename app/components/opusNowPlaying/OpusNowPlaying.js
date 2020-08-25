import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { NoteIcon } from '../svg';
import Styles from './styles';
import firestore from '@react-native-firebase/firestore';
import EStyleSheet from 'react-native-extended-stylesheet';

const component = props => {
  const [currentSong, setCurrentSong] = useState('');

  useEffect(() => {
    const subscriber = firestore()
      .collection('rds')
      .doc('opus')
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot != null) {
          const { info } = documentSnapshot.data();
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
      <View style={Styles.container}>
        <View style={Styles.iconContainer}>
          <View style={Styles.iconButton}>
            <NoteIcon size={12} color={EStyleSheet.value('$darkIcon')} />
          </View>
        </View>
        <Text style={Styles.title}>{currentSong}</Text>
      </View>
    </View>
  );
};

export default component;
