import {useCallback, useRef, useState} from 'react';
import {Article} from '../../../Types';
import {fetchAISearchResults} from '../../api';
import {AISearchResponse, SearchFilter, VertexAIMediaType} from '../../api/Types';
import useCancellablePromise from '../../hooks/useCancellablePromise';
import moment from 'moment';
import {isEqual} from 'lodash';

const PAGE_SIZE = 25;

type ReturnType = {
  searchResults: Article[];
  aiSummary?: string;
  search: (q: string, filter: SearchFilter) => void;
  loadMore: () => void;
  hasMore: boolean;
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
  const [aiSummary, setAiSummary] = useState<string | undefined>(undefined);

  const lastSearchQueryRef = useRef<string | undefined>(undefined);
  const lastFilterRef = useRef<SearchFilter | undefined>(undefined);
  const pageTokenRef = useRef<string | undefined>(undefined);

  const handleResponse = useCallback(
    (response: AISearchResponse, extend: boolean) => {
      setLoadingState({
        idle: false,
        isFetching: false,
        isError: false,
      });
      console.log('Search results:', response);
      pageTokenRef.current = response.nextPageToken;
      setAiSummary(response.aiSummary?.text);
      setSearchResults([
        ...(extend ? searchResults : []),
        ...response.results.map((item) => {
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
      ]);
    },
    [searchResults],
  );

  const cancellablePromise = useCancellablePromise();

  const callApi = useCallback(
    (q: string, filter: SearchFilter, pageToken?: string) => {
      return cancellablePromise(
        fetchAISearchResults({
          query: q ? q.trim() : ' ',
          pageSize: PAGE_SIZE,
          orderBy: filter.orderBy
            ? filter.orderBy === 'OLD_FIRST'
              ? 'available_time'
              : 'available_time desc'
            : undefined,
          pageToken: pageToken,
          includeAISummary: true,
        }),
      );
    },
    [cancellablePromise],
  );

  const search = (q: string, filter: SearchFilter) => {
    const isNewSearch = lastSearchQueryRef.current !== q || !isEqual(lastFilterRef.current, filter);

    if (isNewSearch) {
      lastSearchQueryRef.current = q;
      lastFilterRef.current = filter;
      pageTokenRef.current = undefined;
    }
    setLoadingState({idle: false, isFetching: true, isError: false});
    callApi(q, filter, undefined)
      .then((response) => handleResponse(response, false))
      .catch(() => {
        setLoadingState({
          idle: false,
          isFetching: false,
          isError: true,
        });
      });
  };

  const loadMore = () => {
    if (lastSearchQueryRef.current === undefined || lastFilterRef.current === undefined) {
      console.warn('No search query or filter set');
      return;
    }
    setLoadingState({idle: false, isFetching: true, isError: false});
    callApi(lastSearchQueryRef.current, lastFilterRef.current, pageTokenRef.current)
      .then((response) => handleResponse(response, true))
      .catch(() => {
        setLoadingState({
          idle: false,
          isFetching: false,
          isError: true,
        });
      });
  };

  return {
    loadingState,
    searchResults,
    aiSummary,
    search,
    loadMore,
    hasMore: !!pageTokenRef.current,
  };
};

export default useAISearchApi;
