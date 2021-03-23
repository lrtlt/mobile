import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {AudiotekaNewest, AudiotekaNewestCategory} from '../../../../../../api/Types';
import BlockTitle from '../BlockTitle';
import NewestBlockCategory from './NewestBlockCategory';
import NewestBlockTabs from './NewestBlockTabs';

interface Props {
  data: AudiotekaNewest;
}

const NewestBlock: React.FC<Props> = ({data}) => {
  const [selectedCategory, setSelectedCategory] = useState<AudiotekaNewestCategory>(data.categories[0]);
  return (
    <View style={styles.container}>
      <BlockTitle style={styles.title} text={data.title} />
      <NewestBlockTabs data={data} onCategorySelected={(category) => setSelectedCategory(category)} />
      <NewestBlockCategory data={selectedCategory} />
    </View>
  );
};

export default NewestBlock;

const styles = StyleSheet.create({
  container: {},
  title: {
    marginTop: 8,
    marginHorizontal: 8,
  },
});
