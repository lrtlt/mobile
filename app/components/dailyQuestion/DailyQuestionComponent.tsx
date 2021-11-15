import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {TouchableDebounce} from '..';
import {DailyQuestionChoice, HomeBlockDailyQuestion} from '../../api/Types';
import {selectDailyQuestionChoice} from '../../redux/selectors';
import {useTheme} from '../../Theme';
import {IconCheck} from '../svg';
import TextComponent from '../text/Text';
import {useSetDailyQuestionChoise} from './useSetDailyQuestionChoise';

interface DailyQuestionComponentProps {
  block: HomeBlockDailyQuestion;
}

const DailyQuestionComponent: React.FC<DailyQuestionComponentProps> = ({block}) => {
  const {data: dailyQuestion} = block;
  const {colors, strings} = useTheme();

  const answer = useSelector(selectDailyQuestionChoice);
  const callVoteAPI = useSetDailyQuestionChoise();

  const renderChoise = useCallback(
    (choice: DailyQuestionChoice) => {
      return (
        <View key={choice.id} style={{...styles.choiceContainer, borderColor: colors.buttonBorder}}>
          <TextComponent style={styles.choice}>{choice.name}</TextComponent>
          <TouchableDebounce
            style={styles.voteButton}
            onPress={() => {
              if (dailyQuestion) {
                callVoteAPI(dailyQuestion?.id, choice);
              }
            }}>
            <TextComponent style={styles.voteText}>{strings.daily_question_vote}</TextComponent>
          </TouchableDebounce>
        </View>
      );
    },
    [callVoteAPI, colors.buttonBorder, dailyQuestion, strings.daily_question_vote],
  );

  const renderChoiceVoted = useCallback(
    (choice: DailyQuestionChoice) => {
      const isUserChoice = choice.id === answer?.choice.id ?? -1;
      return (
        <View key={choice.id} style={{...styles.choiceContainer, borderColor: colors.buttonBorder}}>
          <View
            style={{
              ...styles.progressLine,
              backgroundColor: colors.dailyQuestionProgress,
              width: `${choice.percentage}%`,
            }}
          />
          {isUserChoice && (
            <View style={styles.checkBubble}>
              <IconCheck color={'black'} size={12} />
            </View>
          )}
          <TextComponent style={styles.choice}>
            {choice.name}
            <TextComponent style={styles.voteCountText}>
              {'  '}
              {choice.votes}
              <TextComponent style={{...styles.votePercentageText, color: colors.primaryDark}}>
                {'  '}
                {choice.percentage}%
              </TextComponent>
            </TextComponent>
          </TextComponent>
        </View>
      );
    },
    [answer?.choice.id, colors.buttonBorder, colors.dailyQuestionProgress, colors.primaryDark],
  );

  if (!dailyQuestion) {
    return null;
  }

  const isUserVoteAccepted = answer && dailyQuestion.id === answer.daily_question_id;

  return (
    <View style={{...styles.container, borderColor: colors.buttonBorder}}>
      <View style={styles.topContainer}>
        <TextComponent style={styles.title}>{dailyQuestion.title}</TextComponent>
        {isUserVoteAccepted && (
          <TextComponent style={styles.subtitle}>
            Iš viso balsavo:{' '}
            <TextComponent style={{color: colors.primaryDark}}>{dailyQuestion.votes}</TextComponent>
          </TextComponent>
        )}
      </View>
      {dailyQuestion.choices.map(isUserVoteAccepted ? renderChoiceVoted : renderChoise)}
    </View>
  );
};

export default React.memo(DailyQuestionComponent);

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderWidth: 1,
    flex: 1,
  },
  topContainer: {
    padding: 16,
  },
  choiceContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 20,
  },
  subtitle: {
    fontFamily: 'SourceSansPro-Regular',
    marginTop: 16,
    fontSize: 15,
  },
  choice: {
    flex: 1,
    height: '100%',
    fontFamily: 'SourceSansPro-SemiBold',
    marginTop: 16,
    fontSize: 15,
  },
  voteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginLeft: 12,
  },
  voteText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 13,
  },
  voteCountText: {
    fontFamily: 'SourceSansPro-Regular',
    fontSize: 15,
  },
  votePercentageText: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 15,
  },
  checkBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    marginRight: 8,
  },
  progressLine: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    borderRadius: 4,
  },
});
