import { useEffect } from 'react';
import { gameEmitter } from './game.emitter';

export const useGameEvent = <T>(event: string, handler: (payload: T) => unknown): void => {
  useEffect(() => {
    gameEmitter.on(event, handler);

    return () => {
      gameEmitter.off(event, handler);
    };
  }, [event, handler]);
};
