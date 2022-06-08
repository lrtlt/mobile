import React from 'react';

export type TextSelector = {
  selectText: (text: string) => void;
  unselectText: (text: string) => void;
};

const defaultSelection: TextSelector = {
  selectText: () => {},
  unselectText: () => {},
};

export const TextSelectorContext = React.createContext<TextSelector>(defaultSelection);
