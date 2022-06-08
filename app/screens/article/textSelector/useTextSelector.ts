import {useContext} from 'react';
import {TextSelectorContext, TextSelector} from './TextSelectorContext';

export function useTextSelector(): TextSelector {
  return useContext(TextSelectorContext);
}
