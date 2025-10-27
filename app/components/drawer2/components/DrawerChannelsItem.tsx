import {Menu2ItemChannels} from '../../../api/Types';
import {StyleSheet, View} from 'react-native';
import Text from '../../text/Text';
import TouchableDebounce from '../../touchableDebounce/TouchableDebounce';
import {IconChevronLeft} from '../../svg';
import {useTheme} from '../../../Theme';
import {useState} from 'react';
import Divider from '../../divider/Divider';
import PulsingRedDot from './PulsingRedDot';
import ChannelList from '../../scrollingChannels/ChannelList';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../../navigation/MainStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {useCurrentProgram} from '../../../api/hooks/useProgram';

interface Props {
  item: Menu2ItemChannels;
}
const DrawerChannelsItem: React.FC<Props> = ({item}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {data} = useCurrentProgram();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();

  if (item.type !== 'channels') {
    console.warn('DrawerChannelsItem used for non-channels item', item);
    return null;
  }

  const {colors} = useTheme();

  return (
    <View>
      {isExpanded && <Divider style={styles.dividerTop} />}
      <TouchableDebounce style={styles.container} onPress={() => setIsExpanded(!isExpanded)}>
        <View style={styles.row}>
          <PulsingRedDot />
          <Text
            fontFamily="SourceSansPro-SemiBold"
            style={{...styles.text, color: isExpanded ? '#97A2B6' : colors.text}}>
            {item.title}
          </Text>
        </View>
        <IconChevronLeft
          size={16}
          color={colors.text}
          style={{transform: [{rotate: isExpanded ? '270deg' : '90deg'}]}}
        />
      </TouchableDebounce>
      {isExpanded && (
        <View style={styles.channelsWrapper}>
          <ChannelList
            data={data}
            onChannelPress={(channel) => navigation.navigate('Channel', {channelId: channel.channel_id})}
          />
        </View>
      )}
      {isExpanded && <Divider style={{marginTop: 16}} />}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  dividerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  text: {
    fontSize: 15,
  },
  channelsWrapper: {
    paddingLeft: 48,
    paddingRight: 32,
  },
});

export default DrawerChannelsItem;
