import EStyleSheet from 'react-native-extended-stylesheet';
import {Platform} from 'react-native';

export const THEME_LIGHT = 'theme-light';
export const THEME_DARK = 'theme-dark';

const strings = {
  $drawerMenu: 'NAUJIENOS',
  $mainWindow: 'Pagrindinis',
  $tvProgramTitle: 'Tiesiogiai',
  $tvProgram: 'PROGRAMA',
  $tvProgramButtonText: 'VISA PROGRAMA',
  $history: 'ISTORIJA',
  $bookmarks: 'IŠSAUGOTI',
  $liveChannelTitle: 'TIESIOGIAI',
  $channelScreenTitle: 'LRT GYVAI',
  $moreButtonText: 'DAUGIAU',
  $tryAgain: 'Bandykite dar kartą',
  $nightModeTitle: 'Nakties režimas',
  $settings: 'NUSTATYMAI',
  $imageQuality: 'Nuotraukų kokybė',
  $textSizeTitle: 'Šrifto dydis',
  $videoNotAvailable: 'Vaizdo įrašas nepasiekiamas jūsų šalyje',
  $embedArticleHeader: 'TAIP PAT SKAITYKITE',
  $articleError: 'Straipsnis nepasiekiamas',
  $articleHasBeenSaved: 'Straipsnis išsaugotas',
  $liveChanelError: 'Kanalas nepasiekiamas',
  $search: 'PAIEŠKA',
  $upload: 'Įkelk',
  $about: 'Apie LRT',
  $contacts: 'Kontaktai',
  $contacts_url: 'https://apie.lrt.lt/kontaktai/portalas-kontaktai',
  $about_url: 'https://apie.lrt.lt/',
  $upload_news_url: 'https://apie.lrt.lt/bendraukime/rasykite',
  $feeback: 'Pranešk apie klaidą',
  $feedback_url: 'https://apie.lrt.lt/bendraukime/rasykite',

  //error messages
  $error_no_connection: 'Tinklo sutrikimas',
  $error_no_search_query: 'Įveskite paieškos tekstą',
};

const staticColors = {
  $white: 'white',
  $darkIcon: '#222',
  $rippleColor: '#99999940',
  $lightGreyBackground: '#F9F9F9',
};

export const channelColors = {
  color_set_lrtHD: {primary: '#80BCE6', secondary: '#00679C'},
  color_set_lrtPlius: {primary: '#A91B73', secondary: '#721F47'},
  color_set_lrt_world: {primary: '#6D9B36', secondary: '#007A3C'},
  color_set_l_radio: {primary: '#EA8D7A', secondary: '#D92053'},
  color_set_classic: {primary: '#C47FAA', secondary: '#441D56'},
  color_set_opus: {primary: '#F2B12E', secondary: '#E7792B'},
};

export const colorsLight = {
  $primary: '#00679C',
  $primaryLight: '#4da0c9',
  $primaryLightest: '#abdcff',
  $primaryDark: '#111A5F',
  $subtitleColor: '#E00',
  $errorTextColor: '#C00',
  $colorOnPrimary: '#FFF',
  $textColor: '#121212',
  $textColorSecondary: '#555',
  $textColorDisabled: '#55555570',
  $slugBackground: '#F5F6F7',
  $actionButtonBorderColor: 'white',
  $windowBackground: '#FFF',
  $photoOverlay: '#FFFFFFC0',
  $tabBarBackground: '#FFF',
  $tabLableSelectedColor: '$primaryDark',
  $appBarBackground: '#F9F9F9',
  $headerTintColor: '#444',
  $statusBar: '$appBarBackground',
  $greyBackground: '#F4F6F8',
  $playerBackground: '#888',
  $articleHighlight: '#F4F6F820',
  $listSeparator: '#66666616',
  $buttonBorderColor: '#DEE4EA',
  $buttonContentColor: '#999',
  $androidTouchFeedback: '#cadeeb',
  $actionButtonColor: '$primary',
  $actionButtonTint: '$white',
  $programItemColor: '$white',
  $toggleButtonSelected: '#DCE3E9',
  $programProgressColor: '#dce3e9',
  $facebook: '#3b5998',
};

export const colorsDark = {
  $primary: '#AAA',
  $primaryLight: '#666',
  $primaryLightest: '#333',
  $primaryDark: '#CCC',
  $subtitleColor: '#E00',
  $errorTextColor: '#E00',
  $colorOnPrimary: '#FFF',
  $textColor: '#F9F9F9',
  $textColorSecondary: '#B0B0B0',
  $textColorDisabled: '#A0A0A070',
  $slugBackground: '#222b36',
  $actionButtonBorderColor: 'white',
  $windowBackground: '#1C242D',
  $photoOverlay: '#000000C0',
  $tabBarBackground: '#242D36',
  $tabLableSelectedColor: '$primaryDark',
  $appBarBackground: '#242D36',
  $headerTintColor: '#DADADA',
  $statusBar: '$appBarBackground',
  $actionButtonColor: '#333',
  $actionButtonTint: '$white',
  $greyBackground: '#2B3640',
  $articleHighlight: '#2B364060',
  $listSeparator: '#FFFFFF40',
  $buttonBorderColor: '#55555590',
  $buttonContentColor: '#777',
  $playerBackground: '#444',
  $androidTouchFeedback: '#AAA',
  $programItemColor: '#1C242D',
  $programProgressColor: '#36414f',
  $toggleButtonSelected: '#465363',
  $facebook: '#BBB',
};

const tvProgramTheme = {
  $tvSectionTextSize: 18,
  $tvPadding: 2,
  $tvBackgroundColor: '$greyBackground',
  $tvItemWidth: 180,
  $tvChannelTitleTextSize: 12,
  $tvTitleTextSize: 16,
  $tvTimeTextSize: 12,
  $tvBarHeight: 8,

  $tvLiveItemWidth: 230,
  $tvLiveItemHeight: 120,
  $tvLiveItemTextSize: 16,
};

const drawerTheme = {
  $drawerPadding: 10,
  $drawerTitleTextSize: 16,
  $drawerItemTextSize: 15,
};

const articleListTheme = {
  $sectionHeaderTextSize: 18,
  $sectionHeaderTextColor: '$textColor',
  $sectionSeparatorColor: '$primaryDark',
  $sectionPaddingTop: 24,
  $sectionPaddingBottom: 12,

  $slugTitleTextSize: 14,

  $articlePadding: 8,
  $articleExtraPaddingTop: 0,
  $articleExtraPaddingBottom: 8,

  $titleTextColor: '$textColor',
  //Full screen article title
  $titleTextSize: 22,
  //Small article title
  $titleTextSizeSmall: 17,
  //Scrolling article title
  $titleTextSizeMedium: 19,

  $categoryTitleTextColor: '$textColorSecondary',
  $categoryTextSize: 13.5,
  $categoryPaddingTop: 6,

  $mediaIndicatorSize: 36,
  $mediaIndicatorIconSize: 14,

  $photoBadgePadding: 6,
  $photoBadgeIconSize: 18,
  $photoBadgeTextSize: 13.5,

  $facebookIconSize: 20,
};

const articleTheme = {
  $contentPadding: 12,
  $articleTitleFontSize: 25,
  $articleSubtitleFontSize: 15,
  $articleSummaryTextSize: 22,
  $articleSmallTextSize: 14,
  $articleFontSize: 20,
  $paragraphSpacing: 16,
  $paragraphLineExtraSpacing: 6,
  $galleryOpacity: 0.97,
};

export const initTheme = (config) => {
  const isDarkTheme = config.isDarkMode;
  const colors = isDarkTheme === true ? colorsDark : colorsLight;

  EStyleSheet.build({
    $theme: isDarkTheme ? THEME_DARK : THEME_LIGHT,
    $navBarIconSize: Platform.OS === 'android' ? 24 : 22,
    $textSizeMultiplier: config.textSizeMultiplier,
    $screenTitleTextSize: 16,
    ...strings,
    ...staticColors,
    ...colors,
    ...drawerTheme,
    ...articleListTheme,
    ...tvProgramTheme,
    ...articleTheme,
  });
};

export const isDarkTheme = () => {
  return EStyleSheet.value('$theme') === THEME_DARK;
};

export default colorsLight;
