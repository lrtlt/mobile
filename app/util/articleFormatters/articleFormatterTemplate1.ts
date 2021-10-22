import defaultFormatter from './articleFormatterDefault';

/**
 * Big block template for articles.
 * [ 0 ]
 * [1][2][3][4][5]
 * [ 6 ]
 * [7][8]
 * [9][10]
 * [11][12]
 */
const REQUIRED_LENGTH = 13;

const formatter = <T>(articles: T[]): T[][] => {
  if (articles.length < REQUIRED_LENGTH) {
    console.warn(
      'Incorrect article array length: ' + articles.length + '. Minimum required is ' + REQUIRED_LENGTH,
    );
    console.warn('Using default formatter...');
    return defaultFormatter(articles);
  }

  const groupedArticles: T[][] = [];

  let currentColumn = 0;
  let maxColumns = 0;

  articles.forEach((article, i) => {
    switch (i) {
      case 0: {
        maxColumns = 1;
        break;
      }
      case 1:
      case 2:
      case 3:
      case 4:
      case 5: {
        maxColumns = 5;
        break;
      }
      case 6: {
        maxColumns = 1;
        break;
      }
      default: {
        maxColumns = 2;
        break;
      }
    }

    let rowContainer: T[];
    if (currentColumn === 0) {
      if (i === articles.length - 1) {
        //Ignore last article because it does not fit.
        return;
      }

      rowContainer = [];
      groupedArticles.push(rowContainer);
    } else {
      rowContainer = groupedArticles[groupedArticles.length - 1];
    }

    rowContainer.push(article);
    currentColumn++;

    if (currentColumn >= maxColumns) {
      currentColumn = 0;
    }
  });

  return groupedArticles;
};

export default formatter;
