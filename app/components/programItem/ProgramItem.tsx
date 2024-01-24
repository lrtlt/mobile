import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {TouchableDebounce} from '..';
import {MainStackParamList} from '../../navigation/MainStack';
import {useTheme} from '../../Theme';
import {CameraIcon, IconPlay} from '../svg';
import TextComponent from '../text/Text';

export const PROGRAM_ITEM_HEIGHT = 64;

interface Props {
  style?: ViewStyle;
  title: string;
  description?: string;
  record_article_id?: string;
  startTime: string;
  percent: string;
}

const ProgramItem: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {colors} = useTheme();

  const navigation = useNavigation<StackNavigationProp<MainStackParamList, 'Program'>>();

  const proc = Math.max(0, Math.min(Number(props.percent), 100));
  const hasEnded = proc === 100;

  const renderIcon = useCallback(() => {
    if (proc < 100 && proc > 0) {
      return (
        <View style={styles.cameraIconContainer}>
          <CameraIcon size={16} />
        </View>
      );
    } else if (props.record_article_id) {
      return (
        <View style={styles.cameraIconContainer}>
          <IconPlay size={16} color="#a8d2ff" />
        </View>
      );
    }
    return null;
  }, [proc, props.record_article_id]);

  const openArticleHandler = useCallback(() => {
    try {
      const articleId = Number(props.record_article_id);
      navigation.navigate('Article', {articleId});
    } catch (e) {
      console.log(e);
    }
  }, [navigation, props.record_article_id]);

  return (
    <TouchableDebounce
      style={[styles.container, props.style, {backgroundColor: colors.programItem}]}
      disabled={!props.record_article_id}
      onPress={openArticleHandler}>
      <View style={styles.content}>
        <View
          style={{...styles.elapsedIndicator, width: `${proc}%`, backgroundColor: colors.programProgress}}
        />

        <TextComponent style={styles.timeText} type="secondary">
          {props.startTime}
        </TextComponent>
        {renderIcon()}
        <View style={styles.textContainer}>
          <TextComponent
            style={styles.titleText}
            type={proc === 0 ? 'secondary' : 'primary'}
            fontFamily={hasEnded ? 'SourceSansPro-Regular' : 'SourceSansPro-SemiBold'}>
            {props.title}
          </TextComponent>

          {props.description ? (
            <TextComponent style={styles.descriptionText} type="secondary">
              {props.description}
            </TextComponent>
          ) : null}
        </View>
      </View>
    </TouchableDebounce>
  );
};

export default ProgramItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: PROGRAM_ITEM_HEIGHT,
  },
  content: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  cameraIconContainer: {
    paddingEnd: 8,
  },
  elapsedIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
  },
  timeText: {
    paddingEnd: 8,
    paddingStart: 8,

    fontSize: 13,
  },
  titleText: {
    paddingStart: 0,
    fontSize: 15,
  },
  descriptionText: {
    paddingStart: 0,
    marginTop: 2,

    fontSize: 13,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 6,
  },
});
