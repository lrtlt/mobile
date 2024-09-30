import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import useDailyQuestionData from './useDailyQuestionData';
import DailyQuestionComponent from './DailyQuestionComponent';
import {useSettingsStore} from '../../state/settings_store';

interface DailyQuestionWrapperProps {
  id: string | number;
  contentMargin?: number;
}

const VOTES_REFRESH_RATE = 1000 * 15; // 15 sec

const DailyQuestionWrapper: React.FC<DailyQuestionWrapperProps> = ({id, contentMargin}) => {
  const {question, refresh} = useDailyQuestionData(id);
  const answer = useSettingsStore((state) => state.daily_question_response);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (question) {
      const isAnswered = answer?.daily_question_id === question.data.id;
      const isQuestionOngoing = question.data.can_vote && !question.data.is_ended;

      if (isAnswered && isQuestionOngoing) {
        interval = setInterval(() => {
          refresh(question.data.id);
        }, VOTES_REFRESH_RATE);
      }
    }
    return () => clearInterval(interval);
  }, [question, answer]);

  if (question) {
    return (
      <View style={{...styles.container, margin: contentMargin}}>
        <DailyQuestionComponent block={question} />
      </View>
    );
  } else {
    return null;
  }
};

export default DailyQuestionWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
