import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {TouchableDebounce} from '..';
import {MainStackParamList} from '../../navigation/MainStack';
import {IconPlay} from '../svg';
import TextComponent from '../text/Text';
import {getColorsForChannelById} from '../../util/UI';

interface Props {
  style?: ViewStyle;
  title: string;
  description?: string;
  record_article_id?: string;
  startTime: string;
  channelId?: number;
  is_radio?: 1 | 0 | null;
}

const ProgramItemSimple: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Program'>>();

  const onPressHandler = useCallback(() => {
    try {
      if (props.record_article_id) {
        const articleId = Number(props.record_article_id);
        if (props.is_radio) {
          navigation.navigate('Podcast', {articleId});
        } else {
          navigation.navigate('Vodcast', {articleId});
        }
      } else if (props.channelId) {
        navigation.navigate('Channel', {channelId: props.channelId});
      }
    } catch (e) {
      console.log(e);
    }
  }, [navigation, props.record_article_id, props.is_radio]);

  return (
    <TouchableDebounce
      style={[styles.container, props.style]}
      disabled={!props.record_article_id}
      onPress={onPressHandler}>
      <View style={styles.content}>
        <TextComponent
          style={{
            ...styles.timeText,
            backgroundColor: getColorsForChannelById(props.channelId).secondary + '22',
          }}
          type="secondary">
          {props.startTime}
        </TextComponent>
        <View>
          <View style={styles.textContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              {props.record_article_id && (
                <IconPlay size={12} color={getColorsForChannelById(props.channelId).secondary} />
              )}
              <TextComponent
                style={styles.titleText}
                type={props.record_article_id ? 'primary' : 'secondary'}>
                {props.title}
              </TextComponent>
            </View>

            {props.description ? (
              <TextComponent style={styles.descriptionText} type="secondary">
                {props.description}
              </TextComponent>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default ProgramItemSimple;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    gap: 24,
  },

  timeText: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
    fontSize: 13,
  },
  titleText: {
    paddingStart: 0,
    fontSize: 15,
    letterSpacing: 0.1,
  },
  descriptionText: {
    paddingStart: 0,
    marginTop: 2,
    fontSize: 13,
  },
  textContainer: {
    flex: 1,
  },
});
