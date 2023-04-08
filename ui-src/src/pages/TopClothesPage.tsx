import { useEffect } from 'react';
import { gameEmitter } from '../hooks/game';

export const TopClothesPage = () => {
  useEffect(() => {
    gameEmitter.emitAsync('cam:point-at', 'body');
  }, []);
  return <div className="page">top clothes</div>;
};
