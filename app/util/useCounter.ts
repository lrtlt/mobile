import {useEffect} from 'react';
import {fetchCounter} from '../api';

const useCounter = (id: string | number) => {
  useEffect(() => {
    fetchCounter(id);
  }, [id]);
};

export default useCounter;
