import {Article} from '../../../../Types';
import useSeason from './useSeason';

const useNextEpisode = (articleId?: number, season_url?: string): Article | undefined => {
  const {episodes} = useSeason(season_url, undefined, true);

  if (!articleId || !episodes || episodes.length === 0) {
    return undefined;
  }

  const currentEpisodeIndex = episodes.findIndex((episode) => episode.id === articleId);
  if (currentEpisodeIndex === -1 || currentEpisodeIndex === episodes.length - 1) {
    return undefined; // No next episode available
  }

  return episodes[currentEpisodeIndex + 1];
};

export default useNextEpisode;
