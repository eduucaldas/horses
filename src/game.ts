import type { GameConfig, Position } from "./types";
import type { EffectType } from "./narrator";
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
  private onAppleEaten: (() => void) | null = null;

  // Effect state
  private baseTickRate: number;
  private speedOscillateInterval: number | null = null;
  private appleEmoji = "🍎";
  private wrapWalls = false;
  private waitingForWallHit = false;

  constructor(container: HTMLElement, config: GameConfig, tickRate: number = 150) {
    this.config = config;
    this.tickRate = tickRate;
    this.baseTickRate = tickRate;
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

  setOnAppleEaten(callback: () => void): void {
    this.onAppleEaten = callback;
  }

  applyEffect(effect: EffectType): void {
    // Clear any ongoing oscillation and reset speed
    if (this.speedOscillateInterval !== null) {
      clearInterval(this.speedOscillateInterval);
      this.speedOscillateInterval = null;
      this.setTickRate(this.baseTickRate);
    }

    switch (effect) {
      case "invert_controls":
        this.input.setInvertedControls(true);
        break;
      case "normal_controls":
        this.input.setInvertedControls(false);
        break;
      case "speed_2x":
        this.setTickRate(this.baseTickRate / 2);
        break;
      case "speed_half":
        this.setTickRate(this.baseTickRate * 2);
        break;
      case "speed_normal":
        this.setTickRate(this.baseTickRate);
        break;
      case "speed_oscillate":
        this.startSpeedOscillation();
        break;
      case "apple_to_coffee":
        this.appleEmoji = "☕";
        this.render();
        break;
      case "wrap_walls":
        this.wrapWalls = true;
        this.waitingForWallHit = true;
        this.render(); // Re-render to hide the apple
        break;
      case "none":
        // No effect
        break;
      default:
        // Effects handled by main.ts (visual effects)
        break;
    }
  }

  private setTickRate(rate: number): void {
    this.tickRate = rate;
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = window.setInterval(() => {
        this.tick();
      }, this.tickRate);
    }
  }

  private startSpeedOscillation(): void {
    let fast = true;
    this.speedOscillateInterval = window.setInterval(() => {
      if (fast) {
        this.setTickRate(this.baseTickRate / 2);
      } else {
        this.setTickRate(this.baseTickRate * 2);
      }
      fast = !fast;
    }, 1000);
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

    if (this.speedOscillateInterval !== null) {
      clearInterval(this.speedOscillateInterval);
      this.speedOscillateInterval = null;
    }
  }

  private tick(): void {
    const direction = this.input.getDirection();
    if (!direction) return;

    const nextHead = this.herd.peekNextHead(direction);

    // Check if hitting a wall (before wrapping)
    const hittingWall = this.isOutOfBounds(nextHead);

    // Handle wall wrapping
    let wrappedHead = nextHead;
    if (this.wrapWalls) {
      wrappedHead = {
        x: (nextHead.x + this.config.gridWidth) % this.config.gridWidth,
        y: (nextHead.y + this.config.gridHeight) % this.config.gridHeight,
      };
    }

    // When waiting for wall hit, hitting wall counts as eating apple
    const willEatApple = this.waitingForWallHit
      ? hittingWall
      : wrappedHead.x === this.applePosition.x && wrappedHead.y === this.applePosition.y;

    let moved: boolean;
    if (willEatApple) {
      moved = this.herd.grow(direction, this.config, this.wrapWalls);
      if (moved) {
        if (this.waitingForWallHit) {
          this.waitingForWallHit = false;
        }
        this.applePosition = this.spawnApple();
      }
    } else {
      moved = this.herd.move(direction, this.config, this.wrapWalls);
    }

    if (moved) {
      this.render();
      if (willEatApple) {
        this.notifyStateChange();
        if (this.onAppleEaten) {
          this.onAppleEaten();
        }
        if (this.herd.size() >= WIN_HERD_SIZE) {
          this.stop();
          if (this.onWin) {
            this.onWin();
          }
        }
      }
    }
  }

  private isOutOfBounds(position: Position): boolean {
    return (
      position.x < 0 ||
      position.x >= this.config.gridWidth ||
      position.y < 0 ||
      position.y >= this.config.gridHeight
    );
  }

  private render(): void {
    this.renderer.clear();

    // Hide apple when waiting for wall hit
    if (!this.waitingForWallHit) {
      this.renderer.renderEmoji(this.applePosition, this.appleEmoji);
    }

    const positions = this.herd.getPositions();
    const directions = this.herd.getDirections();
    for (let i = 0; i < positions.length; i++) {
      this.renderer.renderEmoji(positions[i], "🐴", directions[i]);
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
