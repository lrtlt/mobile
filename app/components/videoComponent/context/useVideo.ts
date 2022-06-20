import React from 'react';
import {VideoContext, VideoContextType} from './VideoContext';

export function useVideo(): VideoContextType {
  return React.useContext(VideoContext);
}
