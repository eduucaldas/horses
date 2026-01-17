export type Direction = "up" | "down" | "left" | "right";

export class InputHandler {
  private currentDirection: Direction | null = null;
  private nextDirection: Direction | null = null;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start(): void {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  stop(): void {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  getDirection(): Direction | null {
    const direction = this.nextDirection ?? this.currentDirection;
    this.currentDirection = direction;
    this.nextDirection = null;
    return direction;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const direction = this.keyToDirection(event.key);
    if (direction && !this.isOpposite(direction, this.currentDirection)) {
      this.nextDirection = direction;
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
}
