import {useCallback, useState} from 'react';
import {Article} from '../../../Types';
import {fetchAISearchResults} from '../../api';
import {SearchCategorySuggestion, SearchFilter, VertexAIMediaType} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import moment from 'moment';

type ReturnType = {
  searchResults: Article[];
  searchSuggestions: SearchCategorySuggestion[];
  callSearchApi: (q: string, filter: SearchFilter) => void;
  loadingState: {
    idle: boolean;
    isFetching: boolean;
    isError: boolean;
  };
};

const trimCategoryTitle = (title: string): string => {
  return title.replace(/^Naujienos\s*>\s*/, '').trim();
};

const isAudioMediaType = (type: VertexAIMediaType): boolean => {
  switch (type) {
    case 'album':
    case 'audio':
    case 'audio-book':
    case 'music':
    case 'podcast':
    case 'radio':
      return true;
    default:
      return false;
  }
};

const isVideoMediaType = (type: VertexAIMediaType): boolean => {
  switch (type) {
    case 'clip':
    case 'broadcast':
    case 'episode':
    case 'movie':
    case 'tv-series':
    case 'show':
    case 'vlog':
      return true;
    default:
      return false;
  }
};

const useAISearchApi = (): ReturnType => {
  const [loadingState, setLoadingState] = useState({
    idle: true,
    isFetching: false,
    isError: false,
  });

  const [searchResults, setSearchResults] = useState<Article[]>([]);

  const cancellablePromise = useCancellablePromise();

  const callSearchApi = useCallback(
    (q: string, filter: SearchFilter) => {
      setLoadingState({idle: false, isFetching: true, isError: false});
      cancellablePromise(
        fetchAISearchResults(
          q ? q.trim() : ' ',
          100,
          filter.orderBy === 'OLD_FIRST' ? 'available_time' : 'available_time desc',
        ),
      )
        .then((response) => {
          setLoadingState({
            idle: false,
            isFetching: false,
            isError: false,
          });
          console.log('Search results:', response);
          setSearchResults(
            response.results.map((item) => {
              const article: Article = {
                id: Number(item.id),
                badge_class: null,
                category_title: item.document.structData.categories.map(trimCategoryTitle).join(', '),
                title: item.document.structData.title,
                url: item.document.structData.uri,
                photo: item.document.structData.images?.[0]?.uri,
                date: item.document.structData.available_time,
                item_date: moment(item.document.structData.available_time).format('YYYY-MM-DD HH:mm'),
                is_audio: isAudioMediaType(item.document.structData.media_type) ? 1 : 0,
                is_video: isVideoMediaType(item.document.structData.media_type) ? 1 : 0,

                //Other fields to make TypeScript happy
                badge_id: null,
                badge_title: null,
                read_count: 0,
                time_diff_day: null,
                time_diff_hour: null,
              };
              return article;
            }),
          );
          // setSearchSuggestions(response.similar_categories);
        })
        .catch(() => {
          setLoadingState({
            idle: false,
            isFetching: false,
            isError: true,
          });
        });
    },
    [cancellablePromise],
  );

  return {
    loadingState,
    searchResults,
    searchSuggestions: [],
    callSearchApi,
  };
};

export default useAISearchApi;
