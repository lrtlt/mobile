import {TextTrack} from 'react-native-theoplayer';
import {SubtitlePreference} from '../../../../state/settings_store';
import {getLanguageName} from './usePlayerLanguage';

/**
 * Language codes arrive in mixed 2- and 3-letter forms depending on where the track comes
 * from: the API sends `lt` on side-loaded tracks while HLS/DASH manifests tend to announce
 * `lit`. Both forms already fold onto one name in `getLanguageName`, so comparing names is
 * how a preference saved on one kind of stream still matches on the other - without a
 * second alias table that can drift from the one the user sees in the menu. Codes it
 * doesn't know return themselves, so matching degrades to an exact comparison.
 */
const isSameLanguage = (a: string, b: string): boolean =>
  getLanguageName(a.trim()) === getLanguageName(b.trim());

/**
 * The track matching the saved Subtitle Preference, or `undefined` when there is no
 * preference, subtitles are turned off, or this source carries no such language.
 */
export const findPreferredTextTrack = (
  tracks: TextTrack[],
  preference?: SubtitlePreference,
): TextTrack | undefined => {
  if (preference?.kind !== 'language') {
    return undefined;
  }
  return tracks.find((track) => isSameLanguage(track.language, preference.language));
};
