import defaultFormatter from './articleFormatterDefault';
import topFormatter from './articleFormatterTop';
import template1Formatter from './articleFormatterTemplate1';
import template2Formatter from './articleFormatterTemplate2';
import template3Formatter from './articleFormatterTemplate3';
import template999Formatter from './articleFormatterTemplate999';

export const formatArticles = (template_id, articles, clipLast = true) => {
  switch (template_id) {
    case 0: {
      return topFormatter(articles);
    }
    case 1: {
      return template1Formatter(articles);
    }
    case 2: {
      return template2Formatter(articles);
    }
    case 3: {
      return template3Formatter(articles);
    }
    case 999: {
      return template999Formatter(articles);
    }
    default: {
      return defaultFormatter(articles, clipLast);
    }
  }
};
