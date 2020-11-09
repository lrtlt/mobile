import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {JWPlayer} from './app/components';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const VideoTest = ({params}) => (
  <SafeAreaProvider>
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={{width: '100%', height: 300, backgroundColor: '#eee'}} />
          <Text>VideoTest</Text>
          <View style={styles.videoContainer}>
            <JWPlayer
              style={styles.video}
              key="video-test"
              streamUri="https://vod.lrt.lt/mediateka/VIDEO/2020-11/WEB1604926695.mp4/playlist.m3u8"
              autoPlay={true}
              description="Video test"
              title="Video test"
              mediaId="-1"
            />
          </View>
          <View style={{width: '100%', height: 300, backgroundColor: '#eee'}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  </SafeAreaProvider>
);

export default VideoTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#444',
  },
  video: {
    flex: 1,
    //backgroundColor: 'red',
  },
});
