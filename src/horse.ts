import type { Position, GameConfig } from "./types";
import type { Direction } from "./input";

export class Herd {
  private positions: Position[];

  constructor(startPosition: Position) {
    this.positions = [{ ...startPosition }];
  }

  getPositions(): Position[] {
    return this.positions.map((p) => ({ ...p }));
  }

  getHead(): Position {
    return { ...this.positions[0] };
  }

  size(): number {
    return this.positions.length;
  }

  peekNextHead(direction: Direction): Position {
    return this.getNextPosition(this.positions[0], direction);
  }

  move(direction: Direction, config: GameConfig, wrapWalls = false): boolean {
    const head = this.positions[0];
    let newHead = this.getNextPosition(head, direction);

    if (wrapWalls) {
      newHead = this.wrapPosition(newHead, config);
    } else if (!this.isValidPosition(newHead, config)) {
      return false;
    }

    // Move: add new head, remove tail
    this.positions.unshift(newHead);
    this.positions.pop();
    return true;
  }

  grow(direction: Direction, config: GameConfig, wrapWalls = false): boolean {
    const head = this.positions[0];
    let newHead = this.getNextPosition(head, direction);

    if (wrapWalls) {
      newHead = this.wrapPosition(newHead, config);
    } else if (!this.isValidPosition(newHead, config)) {
      return false;
    }

    // Grow: add new head, keep tail
    this.positions.unshift(newHead);
    return true;
  }

  private wrapPosition(position: Position, config: GameConfig): Position {
    return {
      x: (position.x + config.gridWidth) % config.gridWidth,
      y: (position.y + config.gridHeight) % config.gridHeight,
    };
  }

  private getNextPosition(current: Position, direction: Direction): Position {
    switch (direction) {
      case "up":
        return { x: current.x, y: current.y - 1 };
      case "down":
        return { x: current.x, y: current.y + 1 };
      case "left":
        return { x: current.x - 1, y: current.y };
      case "right":
        return { x: current.x + 1, y: current.y };
    }
  }

  private isValidPosition(position: Position, config: GameConfig): boolean {
    return (
      position.x >= 0 &&
      position.x < config.gridWidth &&
      position.y >= 0 &&
      position.y < config.gridHeight
    );
  }
}
