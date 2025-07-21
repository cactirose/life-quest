
import { useState } from "react";

export type DataLoadingStatus = 'loading' | 'loaded' | 'error';

export interface DataStatus {
  character: DataLoadingStatus;
  quests: DataLoadingStatus;
  inventory: DataLoadingStatus;
  skills: DataLoadingStatus;
  habits: DataLoadingStatus;
  moods: DataLoadingStatus;
  achievements: DataLoadingStatus;
}

export const useDataStatus = () => {
  const [dataStatus, setDataStatus] = useState<DataStatus>({
    character: 'loading',
    quests: 'loading',
    inventory: 'loading',
    skills: 'loading',
    habits: 'loading',
    moods: 'loading',
    achievements: 'loading'
  });

  const updateStatus = (key: keyof DataStatus, status: DataLoadingStatus) => {
    setDataStatus(prev => ({ ...prev, [key]: status }));
  };

  return { dataStatus, updateStatus };
};
