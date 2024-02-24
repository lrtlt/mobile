import {useCallback, useEffect, useState} from 'react';
import {fetchDailyQuestion} from '../../api';
import {HomeBlockDailyQuestion} from '../../api/Types';

type ReturnType = {
  question?: HomeBlockDailyQuestion;
  refresh: (id: string | number) => void;
};
const useDailyQuestionData = (id: string | number): ReturnType => {
  const [question, setQuestion] = useState<HomeBlockDailyQuestion | undefined>();

  const refresh = useCallback(async (id: string | number) => {
    try {
      const question = await fetchDailyQuestion(id);
      if (question?.choices?.length) {
        setQuestion({
          type: 'daily_question',
          data: question,
        });
      }
    } catch (e) {
      console.log('Error while fetching daily question', e);
    }
  }, []);

  useEffect(() => {
    refresh(id);
  }, [id]);

  return {
    question,
    refresh,
  };
};

export default useDailyQuestionData;
