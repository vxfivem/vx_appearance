import { useGameEvent } from '../hooks/game';
import { RootState, useAppDispatch } from '../store';

export const StoreSpy = () => {
  const dispatch = useAppDispatch();

  useGameEvent('setStore', (store: RootState) => {
    console.log(store);
  });

  return null!;
};
