/**
 * News feed article template.
 * Pattern below consists of list with a single article in a row.
 *
 * [ 0 ]
 * [ 1 ]
 * [ 2 ]
 * ...
 */

import {Article} from '../../../Types';

const formatter = (articles: Article[]): Article[][] => {
  const groupedArticles: Article[][] = [];

  articles.forEach((article, i) => {
    //Take only first 5.
    if (i < 5) {
      groupedArticles.push([article]);
    }
  });

  return groupedArticles;
};

export default formatter;
