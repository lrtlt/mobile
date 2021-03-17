/**
 * Top news template for top16 articles.
 * Pattern below consists of 15 articles so we drop the last one.
 *
 * [ 0 ]
 * [ 1 ]
 * [2][3]
 * [4][5]
 * [6][7]
 * [ 8 ]
 * [9][10]
 * [11][12]
 * [13][14]
 */

import {Article} from '../../../Types';

const formatter = (articles: Article[]): Article[][] => {
  const groupedArticles: Article[][] = [];

  let currentColumn = 0;
  let maxColumns = 0;

  articles.forEach((article, i) => {
    switch (i) {
      case 0:
      case 1:
      case 8: {
        maxColumns = 1;
        break;
      }
      default: {
        maxColumns = 2;
        break;
      }
    }

    let rowContainer: Article[];
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
