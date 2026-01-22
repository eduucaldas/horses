import { NARRATOR_SCRIPT } from "./narrator";

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
  gridWidth: 15,
  gridHeight: 15,
  cellSize: 32,
};

// Win after eating all apples (one per narrator line) + starting horse
export const WIN_HERD_SIZE = NARRATOR_SCRIPT.length + 1;
