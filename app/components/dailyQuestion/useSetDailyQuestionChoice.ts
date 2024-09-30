import {useCallback, useState} from 'react';
import {DailyQuestionChoice} from '../../api/Types';
import {setDailyQuestionVote} from '../../api';
import {useSettingsStore} from '../../state/settings_store';

export const useSetDailyQuestionChoice = () => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const setDailyQuestionChoice = useSettingsStore((state) => state.setDailyQuestionChoice);

  const callApi = useCallback(
    async (questionId: number, choice: DailyQuestionChoice) => {
      if (state.isLoading) {
        console.log('Wait for the request to end...');
        return;
      }
      setState({isLoading: true});

      try {
        const response = await setDailyQuestionVote(questionId, choice.id);
        if (response.status >= 200 && response.status < 300) {
          setDailyQuestionChoice(questionId, choice);
        }
        setState({isLoading: false});
      } catch (e) {
        setState({isLoading: false});
      }
    },
    [state.isLoading],
  );

  return callApi;
};
