import defaultFormatter from './articleFormatterDefault';
import topFormatter from './articleFormatterTop';
import template1Formatter from './articleFormatterTemplate1';
import template2Formatter from './articleFormatterTemplate2';
import template3Formatter from './articleFormatterTemplate3';
import template9Formatter from './articleFormatterTemplate9';
import template999Formatter from './articleFormatterTemplate999';

export const formatArticles = <T>(template_id: number, articles: T[], clipLast = true): T[][] => {
  if (articles && articles.length === 0) {
    return [];
  }

  switch (template_id) {
    case 0: {
      return topFormatter<T>(articles);
    }
    case 1: {
      return template1Formatter<T>(articles);
    }
    case 2: {
      return template2Formatter<T>(articles);
    }
    case 3: {
      return template3Formatter<T>(articles);
    }
    case 9: {
      return template9Formatter<T>(articles);
    }
    case 999: {
      return template999Formatter<T>(articles);
    }
    default: {
      return defaultFormatter<T>(articles, clipLast);
    }
  }
};
