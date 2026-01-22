export type Direction = "up" | "down" | "left" | "right";

const SWIPE_THRESHOLD = 30; // minimum pixels for a swipe

export class InputHandler {
  private currentDirection: Direction | null = null;
  private nextDirection: Direction | null = null;
  private touchStartX: number | null = null;
  private touchStartY: number | null = null;
  private invertedControls = false;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  start(): void {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("touchstart", this.handleTouchStart, { passive: false });
    window.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    window.addEventListener("touchend", this.handleTouchEnd);
  }

  stop(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }

  setInvertedControls(inverted: boolean): void {
    this.invertedControls = inverted;
  }

  setCurrentDirection(direction: Direction): void {
    this.currentDirection = direction;
  }

  getDirection(): Direction | null {
    const direction = this.nextDirection ?? this.currentDirection;
    this.nextDirection = null;
    return direction;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    let direction = this.keyToDirection(event.key);
    if (direction) {
      event.preventDefault();
      if (this.invertedControls) {
        direction = this.invertDirection(direction);
      }
      if (!this.isOpposite(direction, this.currentDirection)) {
        this.nextDirection = direction;
      }
    }
  }

  private invertDirection(direction: Direction): Direction {
    switch (direction) {
      case "up": return "down";
      case "down": return "up";
      case "left": return "right";
      case "right": return "left";
    }
  }

  private keyToDirection(key: string): Direction | null {
    switch (key) {
      case "ArrowUp":
      case "w":
      case "W":
        return "up";
      case "ArrowDown":
      case "s":
      case "S":
        return "down";
      case "ArrowLeft":
      case "a":
      case "A":
        return "left";
      case "ArrowRight":
      case "d":
      case "D":
        return "right";
      default:
        return null;
    }
  }

  private isOpposite(a: Direction, b: Direction | null): boolean {
    if (!b) return false;
    return (
      (a === "up" && b === "down") ||
      (a === "down" && b === "up") ||
      (a === "left" && b === "right") ||
      (a === "right" && b === "left")
    );
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  private handleTouchMove(event: TouchEvent): void {
    // Prevent scrolling while swiping
    event.preventDefault();
  }

  private handleTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null || this.touchStartY === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;

    this.touchStartX = null;
    this.touchStartY = null;

    let direction = this.swipeToDirection(deltaX, deltaY);
    if (direction) {
      if (this.invertedControls) {
        direction = this.invertDirection(direction);
      }
      if (!this.isOpposite(direction, this.currentDirection)) {
        this.nextDirection = direction;
      }
    }
  }

  private swipeToDirection(deltaX: number, deltaY: number): Direction | null {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX < SWIPE_THRESHOLD && absY < SWIPE_THRESHOLD) {
      return null; // too small to be a swipe
    }

    if (absX > absY) {
      return deltaX > 0 ? "right" : "left";
    } else {
      return deltaY > 0 ? "down" : "up";
    }
  }
}
