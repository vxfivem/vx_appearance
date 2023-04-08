type Eye = { index: number; name: string };
type Parent = { index: number; portrait: string; name: string };
type GameConfig = {
  eyes: Eye[];
  fathers: Parent[];
  mothers: Parent[];
};

export const gameConfig: GameConfig = {
  eyes: [],
  fathers: [],
  mothers: [],
};

export * from './pages';
export * from './colors';
