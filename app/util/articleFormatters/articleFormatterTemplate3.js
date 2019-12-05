import defaultFormatter from './articleFormatterDefault';

/**
 * Slug article template.
 * Pattern below consists of 1 article so we drop others.
 *
 * [ 0 ]
 */

const REQUIRED_LENGTH = 1;

const formatter = articles => {
  if (articles.length < REQUIRED_LENGTH) {
    console.error(
      'Incorrect article array length: ' + articles.length + '. Minimum required is ' + REQUIRED_LENGTH,
    );
    console.warn('Using default formatter...');
    return defaultFormatter(articles);
  }

  const groupedArticles = [[articles[0]]];

  return groupedArticles;
};

export default formatter;
