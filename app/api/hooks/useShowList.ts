import {useQuery} from '@tanstack/react-query';
import {get} from '../HttpClient';

export type ShowListItem = {
  id: number;
  url: string;
  title: string;
  curr: 1 | null;
};

type ShowListSection = {
  letter: {
    l: string;
    big: number | null;
  };
  items: ShowListItem[];
};

type ShowListResponse = {
  program_titles: {
    titles: ShowListSection[];
  };
};

const QUERY_KEY = 'showList';

const SHOW_LIST_MEDIATEKA = 'mediateka';
const SHOW_LIST_RADIOTEKA = 'radioteka';

type ShowListType = typeof SHOW_LIST_MEDIATEKA | typeof SHOW_LIST_RADIOTEKA;

export const useShowList = (type: ShowListType) => {
  return useQuery({
    queryKey: [QUERY_KEY, type],
    queryFn: async ({signal}) => {
      const url =
        type === SHOW_LIST_MEDIATEKA
          ? 'https://www.lrt.lt/api/json/mediateka-laidos'
          : 'https://www.lrt.lt/api/json/radioteka-laidos';
      const response = await get<ShowListResponse>(url, {signal});
      return response.program_titles.titles;
    },
    staleTime: 1000 * 60 * 5,
  });
};
