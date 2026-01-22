import type { Position, GameConfig } from "./types";
import type { Direction } from "./input";

export class Herd {
  private positions: Position[];
  private headDirection: Direction = "right";

  constructor(startPosition: Position) {
    this.positions = [{ ...startPosition }];
  }

  getPositions(): Position[] {
    return this.positions.map((p) => ({ ...p }));
  }

  getDirections(): Direction[] {
    const directions: Direction[] = [this.headDirection];

    // For body segments, calculate direction towards the segment in front
    for (let i = 1; i < this.positions.length; i++) {
      const current = this.positions[i];
      const ahead = this.positions[i - 1];
      directions.push(this.getDirectionBetween(current, ahead));
    }

    return directions;
  }

  private getDirectionBetween(from: Position, to: Position): Direction {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // Handle wrap-around (large jumps mean wrapping)
    if (Math.abs(dx) > 1) {
      return dx > 0 ? "left" : "right";
    }
    if (Math.abs(dy) > 1) {
      return dy > 0 ? "up" : "down";
    }

    if (dx > 0) return "right";
    if (dx < 0) return "left";
    if (dy > 0) return "down";
    return "up";
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
    this.headDirection = direction;
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
    this.headDirection = direction;
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
