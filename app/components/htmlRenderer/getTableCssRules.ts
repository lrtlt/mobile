import {cssRulesFromSpecs, defaultTableStylesSpecs, TableStyleSpecs} from '@native-html/table-plugin';
import {Platform} from 'react-native';
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
      fontSizePx: 13,
      fitContainerWidth: true,
      fitContainerHeight: true,
      cellPaddingEm: 0.5,
      fontFamily: '"SourceSansPro-Regular"',
      thEvenBackground: 'transparent',
      thOddBackground: 'transparent',
      trEvenBackground: 'transparent',
      trOddBackground: 'transparent',
      linkColor: theme.colors.primary,
      rowsBorderWidthPx: 1,

      thEvenColor: theme.colors.textSecondary,
      thOddColor: theme.colors.textSecondary,
      trEvenColor: theme.colors.text,
      trOddColor: theme.colors.text,

      tdBorderColor: theme.colors.border,
      thBorderColor: theme.colors.listSeparator,
      outerBorderColor: theme.colors.border,
      outerBorderWidthPx: 1,
    },
  };

  return (
    cssRulesFromSpecs(tableStyleSpecs) +
    `
        @font-face {
          font-family: 'SourceSansPro-Regular';
          font-weight: 400;
          src: ${sourceSansProRegular}, format('ttf');
        }
        th {
          text-align: left;
          font-weight: bold;
          line-height: 200%;
        }
        td {
          vertical-align: top;
          text-align: left;
          line-height: 200%;
        }
      `
  );
};
