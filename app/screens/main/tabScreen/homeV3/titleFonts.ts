import {TextComponentProps} from '../../../../components/text/Text';

/**
 * Every article title font on the home page in one place. Change a family, size or line height here
 * and every title using that font follows.
 */

export interface TitleFont {
  fontFamily: NonNullable<TextComponentProps['fontFamily']>;
  fontSize: number;
  lineHeight: number;
}

export const TITLE_FONTS = {
  /** Big `ArticleHero`: a lone article at the top of a block. */
  serifBold: {fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 23, lineHeight: 29},
  /** Medium `ArticleHero` and the lead article of the opinions and media blocks. */
  serif: {fontFamily: 'PlayfairDisplay-Regular', fontSize: 23, lineHeight: 29},
  /** Everything else: small `ArticleHero`, list items, grids, cards and rows. */
  sans: {fontFamily: 'SourceSansPro-Regular', fontSize: 18, lineHeight: 22},
} satisfies Record<string, TitleFont>;

export type TitleFontName = keyof typeof TITLE_FONTS;
