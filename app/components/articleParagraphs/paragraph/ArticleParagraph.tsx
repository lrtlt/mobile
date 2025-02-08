import React from 'react';
import HTMLRenderer from '../../htmlRenderer/HTMLRenderer';

interface Props {
  htmlText?: string;
  textSize?: number;
}

const ArticleParagraph: React.FC<React.PropsWithChildren<Props>> = ({htmlText = '', textSize}) => {
  return <HTMLRenderer html={htmlText} textSize={textSize} />;
};

export default ArticleParagraph;
