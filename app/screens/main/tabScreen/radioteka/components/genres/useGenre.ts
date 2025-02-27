import {useCallback, useEffect, useState} from 'react';
import {GenreResponse} from '../../../../../../api/Types';
import useCancellablePromise from '../../../../../../hooks/useCancellablePromise';
import {fetchGenre} from '../../../../../../api';

type GenreState = {
  isLoading: boolean;
  error: Error | null;
  genre: GenreResponse | null;
};

/**
 * Hook to fetch and manage genre data
 * @param genreId - The ID of the genre to fetch
 * @returns An object containing the genre state and a refresh function
 */
const useGenre = (genreId: number | string) => {
  const [state, setState] = useState<GenreState>({
    isLoading: true,
    error: null,
    genre: null,
  });

  const cancellablePromise = useCancellablePromise();

  const fetchGenreInternal = useCallback(async () => {
    if (!genreId) {
      setState({
        isLoading: false,
        error: new Error('Genre ID is required'),
        genre: null,
      });
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await cancellablePromise<GenreResponse>(fetchGenre(genreId));

      setState({
        isLoading: false,
        error: null,
        genre: response,
      });
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch genre'),
        genre: null,
      });
    }
  }, [genreId, cancellablePromise]);

  useEffect(() => {
    fetchGenreInternal();
  }, [fetchGenreInternal]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    genre: state.genre,
    refresh: fetchGenreInternal,
  };
};

export default useGenre;
