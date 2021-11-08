import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {putDailyQuestionVote} from '../../api/Endpoints';
import {put} from '../../api/HttpClient';
import {DailyQuestionChoice} from '../../api/Types';
import {setDailyQuestionChoice} from '../../redux/actions';

export const useSetDailyQuestionChoise = () => {
  const [state, setState] = useState({
    isLoading: false,
  });

  const dispatch = useDispatch();

  const callApi = useCallback(
    async (questionId: number, choise: DailyQuestionChoice) => {
      if (state.isLoading) {
        console.log('Wait for the request to end...');
        return;
      }
      setState({isLoading: true});

      try {
        const response = await put<any | null>(putDailyQuestionVote(questionId, choise.id));
        if (response.status >= 200 && response.status < 300) {
          dispatch(setDailyQuestionChoice(questionId, choise));
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
