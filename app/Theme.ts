import {Theme, useTheme as useReactNavigationTheme} from '@react-navigation/native';

export interface AppTheme extends Theme {
  dark: boolean;
  colors: ColorScheme;
  strings: Dictionary;
  dim: Dimensions;
}

interface Dimensions {
  appBarIconSize: number;
  drawerIconSize: number;
  drawerPadding: number;
}

//#region Strings
interface Dictionary {
  today: string;
  drawerMenu: string;
  mainWindow: string;
  tvProgramTitle: string;
  tvProgram: string;
  tvProgramButtonText: string;
  history: string;
  bookmarks: string;
  liveChannelTitle: string;
  channelScreenTitle: string;
  weatherScreenTitle: string;
  locationSearch: string;
  moreButtonText: string;
  tryAgain: string;
  nightModeTitle: string;
  settings: string;
  imageQuality: string;
  textSizeTitle: string;
  videoNotAvailable: string;
  embedArticleHeader: string;
  articleError: string;
  articleHasBeenSaved: string;
  liveChanelError: string;
  search: string;
  audiotekaSearchPlaceholder: string;
  upload: string;
  about: string;
  contacts: string;
  feeback: string;
  about_episode: string;
  about_show: string;
  no_search_results: string;
  previous_songs: string;
  error_no_connection: string;
  error_no_search_query: string;
  daily_question_vote: string;
}

export const strings: Dictionary = {
  today: 'Šiandien',
  drawerMenu: 'NAUJIENOS',
  mainWindow: 'Pagrindinis',
  tvProgramTitle: 'Tiesiogiai',
  tvProgram: 'PROGRAMA',
  tvProgramButtonText: 'VISA PROGRAMA',
  history: 'ISTORIJA',
  bookmarks: 'IŠSAUGOTI',
  liveChannelTitle: 'Gyvai',
  channelScreenTitle: 'LRT GYVAI',
  weatherScreenTitle: 'ORAI',
  locationSearch: 'Įveskite miestą',
  moreButtonText: 'DAUGIAU',
  tryAgain: 'Bandykite dar kartą',
  nightModeTitle: 'Nakties režimas',
  settings: 'NUSTATYMAI',
  imageQuality: 'Nuotraukų kokybė',
  textSizeTitle: 'Šrifto dydis',
  videoNotAvailable: 'Vaizdo įrašas nepasiekiamas jūsų šalyje',
  embedArticleHeader: 'TAIP PAT SKAITYKITE',
  articleError: 'Straipsnis nepasiekiamas',
  articleHasBeenSaved: 'Straipsnis išsaugotas',
  liveChanelError: 'Kanalas nepasiekiamas',
  search: 'PAIEŠKA',
  audiotekaSearchPlaceholder: 'Ieškoti įrašų',
  upload: 'Įkelk',
  about: 'Apie LRT',
  contacts: 'Kontaktai',
  feeback: 'Pranešk apie klaidą',
  about_episode: 'APIE EPIZODĄ',
  about_show: 'APIE LAIDĄ',
  previous_songs: 'ANKSTESNI',
  no_search_results: 'Deja, rezultatų pagal šią užklausą rasti nepavyko.',
  error_no_connection: 'Tinklo sutrikimas',
  error_no_search_query: 'Įveskite paieškos tekstą',
  daily_question_vote: 'BALSUOTI',
};
//#endregion

//#region ChannelColors
export type ChannelColor = {
  primary: string;
  secondary: string;
};

type ChannelColorScheme = {
  color_set_default: ChannelColor;
  color_set_lrtLT: ChannelColor;
  color_set_lrtHD: ChannelColor;
  color_set_lrtPlius: ChannelColor;
  color_set_lrt_world: ChannelColor;
  color_set_l_radio: ChannelColor;
  color_set_classic: ChannelColor;
  color_set_opus: ChannelColor;
};

export const channelColors: ChannelColorScheme = {
  color_set_lrtHD: {primary: '#83a8d9', secondary: '#0a45bc'},
  color_set_lrtPlius: {primary: '#A91B73', secondary: '#721F47'},
  color_set_lrt_world: {primary: '#6D9B36', secondary: '#007A3C'},
  color_set_l_radio: {primary: '#EA8D7A', secondary: '#D92053'},
  color_set_classic: {primary: '#C47FAA', secondary: '#441D56'},
  color_set_opus: {primary: '#F2B12E', secondary: '#E7792B'},
  color_set_lrtLT: {primary: '#545a94', secondary: '#2f357d'},
  color_set_default: {primary: '#BADAFB', secondary: '#93BDE7'},
};
//#endregion

//#region Colors
type ColorScheme = {
  //#region React-Navigation colors
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  //#endregion

  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  textSecondary: string;
  textDisbled: string;
  textError: string;
  slugBackground: string;
  actionButtonBorder: string;
  photoBackground: string;
  tabBarBackground: string;
  tabLableSelected: string;
  headerTint: string;
  statusBar: string;
  greyBackground: string;
  playerBackground: string;
  articleHighlight: string;
  listSeparator: string;
  buttonBorder: string;
  buttonContent: string;
  androidTouchFeedback: string;
  actionButton: string;
  programItem: string;
  toggleButtonSelected: string;
  programProgress: string;
  facebook: string;
  darkIcon: '#222222';
  ripple: '#99999940';
  lightGreyBackground: '#F9F9F9';
  dailyQuestionProgress: string;
};

const colorsLight: ColorScheme = {
  //#region React-Navigation colors
  primary: '#007aff',
  background: '#FFFFFF',
  card: '#F9F9F9',
  text: '#2E2E2F',
  border: '#AAAAAA',
  notification: '#C00',
  //#endregion

  statusBar: '#F9F9F9',
  primaryLight: '#a8d2ff',
  primaryDark: '#003d80',
  textError: '#C00',
  onPrimary: '#FFFFFF',
  textSecondary: '#666666',
  textDisbled: '#55555570',
  slugBackground: '#F5F6F7',
  actionButtonBorder: '#FFFFFF',
  photoBackground: '#e0e3e9',
  tabBarBackground: '#FFFFFF',
  tabLableSelected: 'primaryDark',
  headerTint: '#444444',
  greyBackground: '#F4F6F8',
  playerBackground: '#888',
  articleHighlight: '#F4F6F820',
  listSeparator: '#66666636',
  buttonBorder: '#DEE4EA',
  buttonContent: '#999',
  androidTouchFeedback: '#cadeeb',
  actionButton: 'primary',
  programItem: 'white',
  toggleButtonSelected: '#DCE3E9',
  programProgress: '#dce3e9AA',
  dailyQuestionProgress: '#dce3e9',
  facebook: '#3b5998',
  darkIcon: '#222222',
  lightGreyBackground: '#F9F9F9',
  ripple: '#99999940',
};

const colorsDark: ColorScheme = {
  //#region React-Navigation colors
  primary: '#AAAAAA',
  background: '#1C242D',
  card: '#242D36',
  text: '#F9F9F9',
  border: '#111111',
  notification: '#C00',
  //#endregion

  statusBar: '#242D36',
  primaryLight: '#333333',
  primaryDark: '#CCCCCC',
  textError: '#E00',
  onPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisbled: '#A0A0A070',
  slugBackground: '#222b36',
  actionButtonBorder: 'white',
  tabBarBackground: '#242D36',
  tabLableSelected: 'primaryDark',
  headerTint: '#DADADA',
  actionButton: '#333333',
  greyBackground: '#2B3640',
  articleHighlight: '#2B364060',
  photoBackground: '#373f4e',
  listSeparator: '#FFFFFF40',
  buttonBorder: '#55555590',
  buttonContent: '#777777',
  playerBackground: '#444444',
  androidTouchFeedback: '#AAAAAA',
  programItem: '#1C242D',
  programProgress: '#36414f',
  toggleButtonSelected: '#465363',
  facebook: '#BBBBBB',
  darkIcon: '#222222',
  lightGreyBackground: '#F9F9F9',
  ripple: '#99999940',
  dailyQuestionProgress: '#36414f',
};
//#endregion

const dimensions: Dimensions = {
  appBarIconSize: 20,
  drawerIconSize: 18,
  drawerPadding: 10,
};

export const themeLight: AppTheme = {
  dark: false,
  colors: colorsLight,
  strings,
  dim: dimensions,
};

export const themeDark: AppTheme = {
  dark: true,
  colors: colorsDark,
  strings,
  dim: dimensions,
};

/** Custom hook to retrieve a theme of type AppTheme */
export function useTheme(): AppTheme {
  return useReactNavigationTheme() as AppTheme;
}
