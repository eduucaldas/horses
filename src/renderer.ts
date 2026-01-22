import type { Position, GameConfig } from "./types";
import type { Direction } from "./input";

export class Renderer {
  private grid: HTMLDivElement;
  private cells: HTMLDivElement[][] = [];
  private container: HTMLElement;
  private config: GameConfig;

  constructor(container: HTMLElement, config: GameConfig) {
    this.container = container;
    this.config = config;
    this.grid = this.createGrid();
    this.container.appendChild(this.grid);
  }

  private createGrid(): HTMLDivElement {
    const grid = document.createElement("div");
    grid.className = "grid gap-0 bg-green-800 p-2 rounded-lg scale-50 sm:scale-75 md:scale-100 origin-top";
    grid.style.gridTemplateColumns = `repeat(${this.config.gridWidth}, ${this.config.cellSize}px)`;
    grid.style.gridTemplateRows = `repeat(${this.config.gridHeight}, ${this.config.cellSize}px)`;
    grid.style.display = "grid";

    for (let y = 0; y < this.config.gridHeight; y++) {
      this.cells[y] = [];
      for (let x = 0; x < this.config.gridWidth; x++) {
        const cell = document.createElement("div");
        cell.className =
          "flex items-center justify-center text-2xl select-none";
        cell.style.width = `${this.config.cellSize}px`;
        cell.style.height = `${this.config.cellSize}px`;
        // Checkerboard pattern for grass effect
        cell.classList.add(
          (x + y) % 2 === 0 ? "bg-green-600" : "bg-green-700"
        );
        grid.appendChild(cell);
        this.cells[y][x] = cell;
      }
    }

    return grid;
  }

  clear(): void {
    for (let y = 0; y < this.config.gridHeight; y++) {
      for (let x = 0; x < this.config.gridWidth; x++) {
        this.cells[y][x].textContent = "";
        this.cells[y][x].style.transform = "";
      }
    }
  }

  renderEmoji(position: Position, emoji: string, direction?: Direction): void {
    if (this.isValidPosition(position)) {
      const cell = this.cells[position.y][position.x];
      cell.textContent = emoji;
      if (direction) {
        cell.style.transform = this.getRotationForDirection(direction);
      }
    }
  }

  private getRotationForDirection(direction: Direction): string {
    // Horse emoji 🐴 faces left by default
    switch (direction) {
      case "left":
        return "";
      case "right":
        return "scaleX(-1)";
      case "up":
        return "rotate(90deg)";
      case "down":
        return "rotate(-90deg)";
    }
  }

  private isValidPosition(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.config.gridWidth &&
      position.y >= 0 &&
      position.y < this.config.gridHeight
    );
  }
}
