import React from 'react';
import {View} from 'react-native';
import {NowPlaying, Text} from '../../components';
import Divider from '../../components/divider/Divider';
import ProgramItemSimple from '../../components/programItem/ProgramItemSimple';
import {ChannelResponse, ProgramItemType} from '../../api/Types';

const PROGRAM_ITEMS_VISIBLE = 5;

interface ChannelProgramComponentProps {
  prog?: ProgramItemType[];
  channelInfo: ChannelResponse['channel_info'];
}

const ChannelProgramComponent: React.FC<ChannelProgramComponentProps> = ({prog, channelInfo}) => {
  if (!prog) {
    return undefined;
  }

  return (
    <>
      {prog.map((item, i) => {
        if (i >= PROGRAM_ITEMS_VISIBLE) {
          return null;
        }

        const marginTop = i > 0 ? 8 : 0;

        if (i === 0) {
          return (
            <View key={item.time_start + item.title}>
              <View style={{gap: 8}}>
                <Text style={{fontSize: 20}} fontFamily="PlayfairDisplay-Regular">
                  {item.title}
                </Text>
                <Text style={{fontSize: 14}} type="secondary">
                  {item.description}
                </Text>
              </View>
              <NowPlaying channelId={channelInfo.channel_id} />
              <Text style={{marginTop: 16, fontSize: 14}}>Toliau</Text>
              <Divider style={{marginVertical: 8}} />
            </View>
          );
        }

        return (
          <View key={item.time_start + item.title}>
            <ProgramItemSimple
              style={{marginTop}}
              title={item.title}
              startTime={item.time_start}
              description={item.description}
              channelId={channelInfo.channel_id}
              record_article_id={item.record_article_id}
              is_radio={item.is_radio}
            />
          </View>
        );
      })}
    </>
  );
};

export default ChannelProgramComponent;
