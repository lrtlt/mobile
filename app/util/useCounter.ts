import {useEffect} from 'react';
import {fetchCounter} from '../api';
import {Platform} from 'react-native';

const useCounter = (id: string | number) => {
  useEffect(() => {
    fetchCounter(id, Platform.OS);
  }, [id]);
};

export default useCounter;
