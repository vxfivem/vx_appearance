import { useState } from 'react';
import { useGameEvent } from './useGameEvent';

export const useGameState = <T>(event: string, defaultValue: T): T => {
  const [value, setValue] = useState(defaultValue);
  useGameEvent(event, setValue);

  return value;
};
