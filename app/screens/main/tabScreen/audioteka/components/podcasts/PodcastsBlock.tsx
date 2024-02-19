import React from 'react';
import {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {AudiotekaPodcasts} from '../../../../../../api/Types';
import {MyScrollView} from '../../../../../../components';
import BlockTitle from '../BlockTitle';
import PodcastListItem from './PodcastListItem';

interface Props {
  data: AudiotekaPodcasts;
}

const PodcastsBlock: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {title, podcasts} = props.data;

  const podcastComponents = useMemo(
    () =>
      podcasts.map((p) => {
        return <PodcastListItem key={p.id} style={styles.listItem} podcast={p} />;
      }),
    [podcasts],
  );

  return (
    <View style={styles.container}>
      <BlockTitle style={styles.title} text={title} />
      <MyScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.scrollContent}>{podcastComponents}</View>
      </MyScrollView>
    </View>
  );
};

export default PodcastsBlock;

const styles = StyleSheet.create({
  container: {},
  title: {
    paddingHorizontal: 8,
  },
  scrollContentContainer: {
    paddingLeft: 4,
  },
  listItem: {
    marginRight: 4,
  },
  scrollContent: {
    flex: 1,
    flexDirection: 'row',
  },
});
