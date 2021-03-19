import defaultFormatter from './articleFormatterDefault';

/**
 * Small block template for articles.
 * Pattern below consists of 3 articles so we drop the last one.
 *
 * [ 0 ]
 * [1][2]
 */

const REQUIRED_LENGTH = 3;

const formatter = <T>(articles: T[]): T[][] => {
  if (articles.length < REQUIRED_LENGTH) {
    console.error(
      'Incorrect article array length: ' + articles.length + '. Minimum required is ' + REQUIRED_LENGTH,
    );
    console.warn('Using default formatter...');
    return defaultFormatter(articles);
  }

  return [[articles[0]], [articles[1], articles[2]]];
};

export default formatter;
