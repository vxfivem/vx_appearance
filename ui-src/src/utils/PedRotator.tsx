import { useEffect } from 'react';
import { gameEmitter } from '../hooks/game';

export const PedRotator = () => {
  useEffect(() => {
    let isReacting = false;
    gameEmitter.on('game:isPaused', (value: boolean) => {
      if (value && isReacting) {
        isReacting = false;
        gameEmitter.emit('rotation:stop');
      }
    });
    const onMouseDown = (e: MouseEvent) => {
      if (isReacting || e.button !== 2) {
        return;
      }

      isReacting = (e.target as HTMLDivElement).classList.contains('app');

      if (!isReacting) {
        return;
      }
      gameEmitter.emit('rotation:start');
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isReacting || e.button !== 2) {
        return;
      }
      isReacting = false;
      gameEmitter.emit('rotation:stop');
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return null;
};
