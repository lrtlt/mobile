import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {DailyQuestionChoice} from '../../api/Types';
import {setDailyQuestionChoice} from '../../redux/actions';
import {setDailyQuestionVote} from '../../api';

export const useSetDailyQuestionChoice = () => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const dispatch = useDispatch();

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
          dispatch(setDailyQuestionChoice(questionId, choice));
        }
        setState({isLoading: false});
      } catch (e) {
        setState({isLoading: false});
      }
    },
    [dispatch, state.isLoading],
  );

  return callApi;
};
