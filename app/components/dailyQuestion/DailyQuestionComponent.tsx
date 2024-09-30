import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {TouchableDebounce} from '..';
import {DailyQuestionChoice, HomeBlockDailyQuestion} from '../../api/Types';
import {useTheme} from '../../Theme';
import {IconCheck} from '../svg';
import TextComponent from '../text/Text';
import {useSetDailyQuestionChoice} from './useSetDailyQuestionChoice';
import {useSettingsStore} from '../../state/settings_store';

interface DailyQuestionComponentProps {
  block: HomeBlockDailyQuestion;
}

const DailyQuestionComponent: React.FC<DailyQuestionComponentProps> = ({block}) => {
  const {data: dailyQuestion} = block;
  const {colors, strings} = useTheme();

  const answer = useSettingsStore((state) => state.daily_question_response);
  const callVoteAPI = useSetDailyQuestionChoice();

  const renderChoice = useCallback(
    (choice: DailyQuestionChoice) => {
      return (
        <View key={choice.id} style={{...styles.choiceContainer, borderColor: colors.buttonBorder}}>
          <TextComponent style={styles.choice} fontFamily="SourceSansPro-SemiBold">
            {choice.name}
          </TextComponent>
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
      const isUserChoice = choice.id === (answer?.choice.id ?? -1);
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
          <TextComponent style={styles.choice} fontFamily="SourceSansPro-SemiBold">
            {choice.name}
            <TextComponent style={styles.voteCountText}>
              {'  '}
              {choice.votes}
              <TextComponent
                style={{...styles.votePercentageText, color: colors.primaryDark}}
                fontFamily="SourceSansPro-SemiBold">
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

  const votingEnabled = dailyQuestion.can_vote && !dailyQuestion.is_ended;
  const isUserVoteAccepted = answer && dailyQuestion.id === answer.daily_question_id;
  const canUserVote = votingEnabled && !isUserVoteAccepted;
  return (
    <View style={{...styles.container, borderColor: colors.buttonBorder}}>
      <View style={styles.topContainer}>
        <TextComponent style={styles.title} fontFamily="PlayfairDisplay-Regular">
          {dailyQuestion.title}
        </TextComponent>
        {!canUserVote && (
          <TextComponent style={styles.subtitle}>
            Iš viso balsavo:{' '}
            <TextComponent style={{color: colors.primaryDark}}>{dailyQuestion.votes}</TextComponent>
          </TextComponent>
        )}
      </View>
      {dailyQuestion.choices.map(canUserVote ? renderChoice : renderChoiceVoted)}
    </View>
  );
};

export default React.memo(DailyQuestionComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
  },
  topContainer: {
    padding: 16,
  },
  choiceContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 15,
  },
  choice: {
    flex: 1,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  voteButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteText: {
    fontSize: 13,
  },
  voteCountText: {
    fontSize: 15,
  },
  votePercentageText: {
    fontSize: 15,
  },
  checkBubble: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
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
