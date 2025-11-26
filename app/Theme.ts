import {Theme} from '@react-navigation/native';
import {ThemeContext} from './theme/ThemeContext';
import {useContext} from 'react';

export interface AppTheme extends Theme {
  dark: boolean;
  simplyfied: boolean;
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
  favorites: string;
  liveChannelTitle: string;
  channelScreenTitle: string;
  weatherScreenTitle: string;
  locationSearch: string;
  moreButtonText: string;
  tryAgain: string;
  nightModeTitle: string;
  settings: string;
  user: string;
  profile: string;
  textSizeTitle: string;
  videoNotAvailable: string;
  embedArticleHeader: string;
  articleError: string;
  articleHasBeenSaved: string;
  liveChanelError: string;
  search: string;
  audiotekaSearchPlaceholder: string;
  upload: string;
  contacts: string;
  feeback: string;
  about_episode: string;
  about_show: string;
  about_playlist: string;
  no_search_results: string;
  previous_songs: string;
  error_no_connection: string;
  error_no_search_query: string;
  error_common: string;
  daily_question_vote: string;
  close: string;
  stream_blocked_warning: string;
  remove_from_bookmarks: string;
  related_genres: string;
  menu_weather: string;
  menu_shop: string;
  menu_newsletter: string;
  menu_contacts: string;
  menu_about: string;
  login: string;
  logout: string;
}

export const strings: Dictionary = {
  today: 'Šiandien',
  drawerMenu: 'NAUJIENOS',
  mainWindow: 'Pagrindinis',
  tvProgramTitle: 'Šiuo metu eteryje',
  tvProgram: 'PROGRAMA',
  tvProgramButtonText: 'VISA PROGRAMA',
  history: 'ISTORIJA',
  bookmarks: 'IŠSAUGOTI',
  favorites: 'MĖGSTAMIAUSI',
  liveChannelTitle: 'Gyvai',
  channelScreenTitle: 'LRT GYVAI',
  weatherScreenTitle: 'ORAI',
  locationSearch: 'Įveskite miestą',
  moreButtonText: 'Daugiau',
  tryAgain: 'Bandykite dar kartą',
  nightModeTitle: 'Nakties režimas',
  settings: 'NUSTATYMAI',
  user: 'VARTOTOJAS',
  profile: 'PROFILIS',
  textSizeTitle: 'Šrifto dydis',
  videoNotAvailable: 'Vaizdo įrašas nepasiekiamas jūsų šalyje',
  embedArticleHeader: 'TAIP PAT SKAITYKITE',
  articleError: 'Straipsnis nepasiekiamas',
  articleHasBeenSaved: 'Straipsnis išsaugotas',
  liveChanelError: 'Kanalas nepasiekiamas',
  search: 'PAIEŠKA',
  audiotekaSearchPlaceholder: 'Ieškoti įrašų',
  upload: 'Įkelk',

  contacts: 'Kontaktai',
  feeback: 'Pranešk apie klaidą',
  about_episode: 'Apie epizodą',
  about_show: 'Apie laidą',
  about_playlist: 'Apie grojaraštį',
  previous_songs: 'ANKSTESNI',
  no_search_results: 'Deja, rezultatų pagal šią užklausą rasti nepavyko.',
  error_no_connection: 'Tinklo sutrikimas',
  error_no_search_query: 'Įveskite paieškos tekstą',
  error_common: 'Įvyko klaida',
  daily_question_vote: 'BALSUOTI',
  close: 'Uždaryti',
  stream_blocked_warning: 'Transliacija internetu negalima dėl autorių teisių apribojimų.',
  remove_from_bookmarks: 'Pašalinti iš išsaugotų',
  related_genres: 'Susiję žanrai',
  menu_weather: 'Orai',
  menu_newsletter: 'Naujienlaiškis',
  menu_shop: 'LRT parduotuvė',
  menu_contacts: 'Susisiekite',
  menu_about: 'Apie LRT',
  login: 'Prisijungti',
  logout: 'Atsijungti',
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
  color_set_lrtHD: {primary: '#83a8d9', secondary: '#2C478B'},
  color_set_lrtPlius: {primary: '#A91B73', secondary: '#7D2B7C'},
  color_set_lrt_world: {primary: '#6D9B36', secondary: '#64B445'},
  color_set_l_radio: {primary: '#EA8D7A', secondary: '#C4242C'},
  color_set_classic: {primary: '#C47FAA', secondary: '#603680'},
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
  tertiary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  textSecondary: string;
  textDisbled: string;
  textError: string;
  slugBackground: string;
  articleSummaryBackground: string;
  actionButtonBorder: string;
  photoBackground: string;
  tabBarBackground: string;
  tabLableSelected: string;
  headerTint: string;
  statusBar: string;
  greyBackground: string;
  darkGreyBackground: string;
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
  epikaGreen: '#58EB52';
  playerIcons: 'rgb(217, 32, 83)';
  radiotekaPlayButton: string;
  radiotekaBackground: string;
  mediatekaPlayButton: string;
  iconInactive: string;
  iconActive: string;
};

const colorsLight: ColorScheme = {
  //#region React-Navigation colors
  // primary: '#2F357D',
  primary: '#333399',
  background: '#FFFFFF',
  card: '#F9F9F9',
  text: '#02030D',
  border: '#AAAAAA',
  notification: '#C00',
  //#endregion
  tertiary: '#007AFF',
  statusBar: '#F9F9F9',
  primaryLight: '#bbbdd7',
  primaryDark: '#202557',
  textError: '#C00',
  onPrimary: '#FFFFFF',
  textSecondary: '#666666',
  textDisbled: '#55555570',
  slugBackground: '#F5F6F7',
  articleSummaryBackground: '#F3F6F9',
  actionButtonBorder: '#FFFFFF',
  photoBackground: '#e0e3e9',
  tabBarBackground: '#FFFFFF',
  tabLableSelected: 'primaryDark',
  headerTint: '#444444',
  greyBackground: '#F4F6F8',
  darkGreyBackground: 'rgb(228, 228, 231)',
  lightGreyBackground: '#F9F9F9',
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

  ripple: '#99999940',
  epikaGreen: '#58EB52',
  playerIcons: 'rgb(217, 32, 83)',
  radiotekaPlayButton: '#FFD600',
  radiotekaBackground: '#EEEFF4',
  mediatekaPlayButton: '#4258FF',
  iconInactive: '#9A9A9E',
  iconActive: '#0078D6',
};

const colorsDark: ColorScheme = {
  //#region React-Navigation colors
  primary: '#AAAAAA',
  background: '#141a21',
  card: '#242D36',
  text: '#F9F9F9',
  border: '#666',
  notification: '#C00',
  //#endregion
  tertiary: '#FFFFFF',
  statusBar: '#242D36',
  primaryLight: '#333333',
  primaryDark: '#CCCCCC',
  textError: '#E00',
  onPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisbled: '#A0A0A070',
  slugBackground: '#222b36',
  articleSummaryBackground: '#1C242D',
  actionButtonBorder: 'white',
  tabBarBackground: '#242D36',
  tabLableSelected: 'primaryDark',
  headerTint: '#DADADA',
  actionButton: '#333333',
  greyBackground: '#2B3640',
  darkGreyBackground: 'rgb(228, 228, 231)',
  lightGreyBackground: '#F9F9F9',
  articleHighlight: '#2B364060',
  photoBackground: '#373f4e',
  listSeparator: '#666666',
  buttonBorder: '#55555590',
  buttonContent: '#777777',
  playerBackground: '#444444',
  androidTouchFeedback: '#AAAAAA',
  programItem: '#1C242D',
  programProgress: '#36414f',
  toggleButtonSelected: '#465363',
  facebook: '#BBBBBB',
  darkIcon: '#222222',
  ripple: '#99999940',
  dailyQuestionProgress: '#36414f',
  epikaGreen: '#58EB52',
  playerIcons: 'rgb(217, 32, 83)',
  radiotekaPlayButton: '#FFD600',
  radiotekaBackground: '#11161c',
  mediatekaPlayButton: '#4258FF',
  iconInactive: '#9A9A9E',
  iconActive: '#0078D6',
};
//#endregion

const dimensions: Dimensions = {
  appBarIconSize: 20,
  drawerIconSize: 18,
  drawerPadding: 10,
};

const fonts: Theme['fonts'] = {
  regular: {
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'SourceSansPro-SemiBold',
    fontWeight: 'bold',
  },
  heavy: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontWeight: 'bold',
  },
};

export const themeLight: AppTheme = {
  dark: false,
  simplyfied: false,
  colors: colorsLight,
  strings,
  dim: dimensions,
  fonts: fonts,
};

export const themeDark: AppTheme = {
  dark: true,
  simplyfied: false,
  colors: colorsDark,
  strings,
  dim: dimensions,
  fonts: fonts,
};

/** Custom hook to retrieve a theme of type AppTheme */
export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}
