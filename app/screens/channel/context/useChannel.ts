import React from 'react';
import {ChannelContext, ChannelContextType} from './ChannelContext';

export function useChannel(): ChannelContextType {
  return React.useContext(ChannelContext);
}
