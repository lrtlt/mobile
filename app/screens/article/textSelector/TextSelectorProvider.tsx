import React, {useCallback, useRef} from 'react';
import {TextSelectorContext} from './TextSelectorContext';

const TextSelectorProvider: React.FC = (props) => {
  const {current: content} = useRef<string[]>([]);

  const selectText = useCallback(
    (text: string) => {
      if (!content.includes(text)) {
        content.push(text);
      }
      console.log(content.join('\n\n'));
    },
    [content],
  );

  const unselectText = useCallback(
    (text: string) => {
      console.log('length', content.length);
      if (content.length === 1) {
        content.pop();
        console.log(content.join('\n\n'));
        return;
      }
      const i = content.findIndex((t) => t === text);
      console.log('index', i);
      if (i > 0) {
        content.splice(i, 1);
        console.log(content.join('\n\n'));
      }
    },
    [content],
  );

  return (
    <TextSelectorContext.Provider
      value={{
        selectText,
        unselectText,
      }}>
      {props.children}
    </TextSelectorContext.Provider>
  );
};

export default TextSelectorProvider;
