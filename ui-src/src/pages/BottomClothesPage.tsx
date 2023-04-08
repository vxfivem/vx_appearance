import { useEffect } from 'react';
import { gameEmitter } from '../hooks/game';

export const BotttomClothesPage = () => {
  useEffect(() => {
    gameEmitter.emitAsync('cam:point-at', 'legs');
  }, []);
  return <div className="page">bottom clothes</div>;
};
