import {useCallback, useEffect, useState} from 'react';

import useCancellablePromise from '../../../../../../hooks/useCancellablePromise';
import {fetchArticlesByGenre} from '../../../../../../api';
import {ArticleSearchItem} from '../../../../../../api/Types';

type GenreLatestState = {
  isLoading: boolean;
  error: Error | null;
  shows: ArticleSearchItem[];
};

/**
 * Hook to fetch and manage latest shows for a genre
 * @param genreId - The ID of the genre to fetch latest shows for
 * @returns An object containing the latest shows state and a refresh function
 */
const useGenreLatest = (genreId: number | string) => {
  const [state, setState] = useState<GenreLatestState>({
    isLoading: true,
    error: null,
    shows: [],
  });

  const cancellablePromise = useCancellablePromise();

  const fetchLatestShows = useCallback(async () => {
    if (!genreId) {
      setState({
        isLoading: false,
        error: new Error('Genre ID is required'),
        shows: [],
      });
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await cancellablePromise(fetchArticlesByGenre(genreId, 10));
      setState({
        isLoading: false,
        error: null,
        shows: response.items,
      });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch latest shows'),
        shows: [],
      });
    }
  }, [genreId, cancellablePromise]);

  useEffect(() => {
    fetchLatestShows();
  }, [fetchLatestShows]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    shows: state.shows,
    refresh: fetchLatestShows,
  };
};

export default useGenreLatest;
