export interface Position {
  x: number;
  y: number;
}

export interface GameConfig {
  gridWidth: number;
  gridHeight: number;
  cellSize: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridWidth: 20,
  gridHeight: 15,
  cellSize: 32,
};
