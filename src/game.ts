import type { GameConfig, Position } from "./types";
import { WIN_HERD_SIZE } from "./types";
import { Renderer } from "./renderer";
import { InputHandler } from "./input";
import { Herd } from "./horse";

export type GameState = {
  herdSize: number;
  isRunning: boolean;
};

export class Game {
  private renderer: Renderer;
  private input: InputHandler;
  private herd: Herd;
  private applePosition: Position;
  private tickInterval: number | null = null;
  private isRunning = false;
  private config: GameConfig;
  private tickRate: number;
  private onStateChange: ((state: GameState) => void) | null = null;
  private onWin: (() => void) | null = null;

  constructor(container: HTMLElement, config: GameConfig, tickRate: number = 150) {
    this.config = config;
    this.tickRate = tickRate;
    this.renderer = new Renderer(container, config);
    this.input = new InputHandler();

    const startX = Math.floor(config.gridWidth / 2);
    const startY = Math.floor(config.gridHeight / 2);
    this.herd = new Herd({ x: startX, y: startY });

    this.applePosition = this.spawnApple();
  }

  setOnStateChange(callback: (state: GameState) => void): void {
    this.onStateChange = callback;
  }

  setOnWin(callback: () => void): void {
    this.onWin = callback;
  }

  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.input.start();
    this.render();
    this.notifyStateChange();

    this.tickInterval = window.setInterval(() => {
      this.tick();
    }, this.tickRate);
  }

  private notifyStateChange(): void {
    if (this.onStateChange) {
      this.onStateChange({
        herdSize: this.herd.size(),
        isRunning: this.isRunning,
      });
    }
  }

  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    this.input.stop();

    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tick(): void {
    const direction = this.input.getDirection();
    if (!direction) return;

    const nextHead = this.herd.peekNextHead(direction);
    const willEatApple =
      nextHead.x === this.applePosition.x && nextHead.y === this.applePosition.y;

    let moved: boolean;
    if (willEatApple) {
      moved = this.herd.grow(direction, this.config);
      if (moved) {
        this.applePosition = this.spawnApple();
      }
    } else {
      moved = this.herd.move(direction, this.config);
    }

    if (moved) {
      this.render();
      if (willEatApple) {
        this.notifyStateChange();
        if (this.herd.size() >= WIN_HERD_SIZE) {
          this.stop();
          if (this.onWin) {
            this.onWin();
          }
        }
      }
    }
  }

  private render(): void {
    this.renderer.clear();
    this.renderer.renderEmoji(this.applePosition, "🍎");

    const positions = this.herd.getPositions();
    for (const pos of positions) {
      this.renderer.renderEmoji(pos, "🐴");
    }
  }

  private spawnApple(): Position {
    const herdPositions = this.herd.getPositions();
    let position: Position;

    do {
      position = {
        x: Math.floor(Math.random() * this.config.gridWidth),
        y: Math.floor(Math.random() * this.config.gridHeight),
      };
    } while (this.isOccupied(position, herdPositions));

    return position;
  }

  private isOccupied(position: Position, occupied: Position[]): boolean {
    return occupied.some((p) => p.x === position.x && p.y === position.y);
  }
}
