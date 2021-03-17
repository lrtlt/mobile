/**
 * Default template for articles.
 * Pattern below requires odd number of articles so we drop the last one if it's even.
 * [ 0 ]
 * [1][2]
 * [3][4]
 * [5][6]
 * ...
 */

import {Article} from '../../../Types';

const formatter = (articles: Article[], clipLast: boolean = false): Article[][] => {
  const groupedArticles: Article[][] = [];

  let currentColumn = 0;
  let maxColumns = 0;

  articles.forEach((article, i) => {
    switch (i) {
      case 0: {
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
      if (i === articles.length - 1 && clipLast === true) {
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
