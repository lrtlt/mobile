import {Platform} from 'react-native';
import {Theme, useTheme as useReactNavigationTheme} from '@react-navigation/native';

interface AppTheme extends Theme {
  dark: boolean;
  colors: ColorScheme;
  strings: Dictionary;
  dim: Dimensions;
}

interface Dimensions {
  appBarIconSize: number;
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
  upload: string;
  about: string;
  contacts: string;
  feeback: string;

  //error messages
  error_no_connection: string;
  error_no_search_query: string;
}

const str: Dictionary = {
  today: 'Šiandien',
  drawerMenu: 'NAUJIENOS',
  mainWindow: 'Pagrindinis',
  tvProgramTitle: 'Tiesiogiai',
  tvProgram: 'PROGRAMA',
  tvProgramButtonText: 'VISA PROGRAMA',
  history: 'ISTORIJA',
  bookmarks: 'IŠSAUGOTI',
  liveChannelTitle: 'TIESIOGIAI',
  channelScreenTitle: 'LRT GYVAI',
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
  upload: 'Įkelk',
  about: 'Apie LRT',
  contacts: 'Kontaktai',
  feeback: 'Pranešk apie klaidą',
  error_no_connection: 'Tinklo sutrikimas',
  error_no_search_query: 'Įveskite paieškos tekstą',
};
//#endregion

//#region ChannelColors
type ChannelColor = {
  primary: string;
  secondary: string;
};

type ChannelColorScheme = {
  color_set_lrtHD: ChannelColor;
  color_set_lrtPlius: ChannelColor;
  color_set_lrt_world: ChannelColor;
  color_set_l_radio: ChannelColor;
  color_set_classic: ChannelColor;
  color_set_opus: ChannelColor;
};

export const channelColors: ChannelColorScheme = {
  color_set_lrtHD: {primary: '#80BCE6', secondary: '#00679C'},
  color_set_lrtPlius: {primary: '#A91B73', secondary: '#721F47'},
  color_set_lrt_world: {primary: '#6D9B36', secondary: '#007A3C'},
  color_set_l_radio: {primary: '#EA8D7A', secondary: '#D92053'},
  color_set_classic: {primary: '#C47FAA', secondary: '#441D56'},
  color_set_opus: {primary: '#F2B12E', secondary: '#E7792B'},
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
  primaryLightest: string;
  primaryDark: string;
  onPrimary: string;
  textSecondary: string;
  textDisbled: string;
  textError: string;
  slugBackground: string;
  actionButtonBorder: string;
  photoOverlay: string;
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
  darkIcon: '#222';
  ripple: '#99999940';
  lightGreyBackground: '#F9F9F9';
};

const colorsLight: ColorScheme = {
  //#region React-Navigation colors
  primary: '#00679C',
  background: '#FFFFFF',
  card: '#F9F9F9',
  text: '#121212',
  border: '#AAA',
  notification: '#C00',
  //#endregion

  statusBar: '#F9F9F9',
  primaryLight: '#4da0c9',
  primaryLightest: '#abdcff',
  primaryDark: '#111A5F',
  textError: '#C00',
  onPrimary: '#FFF',
  textSecondary: '#555',
  textDisbled: '#55555570',
  slugBackground: '#F5F6F7',
  actionButtonBorder: 'white',
  photoOverlay: '#FFFFFFC0',
  tabBarBackground: '#FFF',
  tabLableSelected: 'primaryDark',
  headerTint: '#444',
  greyBackground: '#F4F6F8',
  playerBackground: '#888',
  articleHighlight: '#F4F6F820',
  listSeparator: '#66666616',
  buttonBorder: '#DEE4EA',
  buttonContent: '#999',
  androidTouchFeedback: '#cadeeb',
  actionButton: 'primary',
  programItem: 'white',
  toggleButtonSelected: '#DCE3E9',
  programProgress: '#dce3e9',
  facebook: '#3b5998',
  darkIcon: '#222',
  lightGreyBackground: '#F9F9F9',
  ripple: '#99999940',
};

const colorsDark: ColorScheme = {
  //#region React-Navigation colors
  primary: '#AAA',
  background: '#1C242D',
  card: '#242D36',
  text: '#F9F9F9',
  border: '#111111',
  notification: '#C00',
  //#endregion

  statusBar: '#242D36',
  primaryLight: '#666',
  primaryLightest: '#333',
  primaryDark: '#CCC',
  textError: '#E00',
  onPrimary: '#FFF',
  textSecondary: '#B0B0B0',
  textDisbled: '#A0A0A070',
  slugBackground: '#222b36',
  actionButtonBorder: 'white',
  photoOverlay: '#000000C0',
  tabBarBackground: '#242D36',
  tabLableSelected: 'primaryDark',
  headerTint: '#DADADA',
  actionButton: '#333',
  greyBackground: '#2B3640',
  articleHighlight: '#2B364060',
  listSeparator: '#FFFFFF40',
  buttonBorder: '#55555590',
  buttonContent: '#777',
  playerBackground: '#444',
  androidTouchFeedback: '#AAA',
  programItem: '#1C242D',
  programProgress: '#36414f',
  toggleButtonSelected: '#465363',
  facebook: '#BBB',
  darkIcon: '#222',
  lightGreyBackground: '#F9F9F9',
  ripple: '#99999940',
};
//#endregion

const dimensions: Dimensions = {
  appBarIconSize: Platform.OS === 'android' ? 24 : 22,
};

export const themeLight: AppTheme = {
  dark: false,
  colors: colorsLight,
  strings: str,
  dim: dimensions,
};

export const themeDark: AppTheme = {
  dark: true,
  colors: colorsDark,
  strings: str,
  dim: dimensions,
};

/** Custom hook to retrieve a theme of type AppTheme */
export function useTheme(): AppTheme {
  return useReactNavigationTheme() as AppTheme;
}
