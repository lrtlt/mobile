import {cssRulesFromSpecs, defaultTableStylesSpecs, TableStyleSpecs} from '@native-html/table-plugin';
import {Platform, StyleSheet} from 'react-native';
import {AppTheme} from '../../Theme';

function getFontAssetURL(fontFileName: string) {
  return Platform.select({
    ios: `url(${fontFileName})`,
    android: `url(file://android_asset/fonts/${fontFileName})`,
  });
}

export default (theme: AppTheme): string => {
  const sourceSansProRegular = getFontAssetURL('SourceSansPro-Regular.ttf');

  const tableStyleSpecs: TableStyleSpecs = {
    ...defaultTableStylesSpecs,
    ...{
      fitContainerWidth: true,
      fontFamily: 'sans-serif',
      thEvenBackground: 'transparent',
      thOddBackground: 'transparent',
      trEvenBackground: 'transparent',
      trOddBackground: theme.colors.lightGreyBackground,
      linkColor: theme.colors.text,
      rowsBorderWidthPx: StyleSheet.hairlineWidth,
      fitContainerHeight: true,
      tdBorderColor: theme.colors.listSeparator,
    },
  };

  return (
    cssRulesFromSpecs(tableStyleSpecs) +
    `
        @font-face {
          font-family: 'SourceSansPro-Regular';
          font-style: normal;
          font-weight: 400;
          src: ${sourceSansProRegular}, format('opentype');
        }
        th {
          text-align: left;
        }
        td {
          vertical-align: top;
          text-align: left;
          line-height: 200%;
        }
      `
  );
};
