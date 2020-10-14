import { createContext } from 'react';
import { IViewer } from '../interfaces';

export const ViewerContext = createContext<IViewer | null>(
  (window as any).bootstrapData.viewer,
);
