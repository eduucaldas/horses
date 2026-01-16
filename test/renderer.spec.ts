import { describe, it, expect, beforeEach } from "vitest";
import { Renderer } from "../src/renderer";
import { DEFAULT_CONFIG } from "../src/types";

describe("Renderer", () => {
  let container: HTMLDivElement;
  let renderer: Renderer;

  beforeEach(() => {
    container = document.createElement("div");
    renderer = new Renderer(container, DEFAULT_CONFIG);
  });

  it("creates a grid with correct dimensions", () => {
    const grid = container.querySelector("div");
    expect(grid).not.toBeNull();

    const cells = grid!.children;
    expect(cells.length).toBe(DEFAULT_CONFIG.gridWidth * DEFAULT_CONFIG.gridHeight);
  });

  it("renders emoji at specified position", () => {
    renderer.renderEmoji({ x: 0, y: 0 }, "🐴");

    const grid = container.querySelector("div");
    const firstCell = grid!.children[0];
    expect(firstCell.textContent).toBe("🐴");
  });

  it("clears all cells", () => {
    renderer.renderEmoji({ x: 0, y: 0 }, "🐴");
    renderer.renderEmoji({ x: 1, y: 0 }, "🍎");
    renderer.clear();

    const grid = container.querySelector("div");
    const cells = Array.from(grid!.children);
    const allEmpty = cells.every((cell) => cell.textContent === "");
    expect(allEmpty).toBe(true);
  });

  it("renders emoji at correct grid position", () => {
    const position = { x: 5, y: 3 };
    renderer.renderEmoji(position, "🍎");

    const grid = container.querySelector("div");
    const cellIndex = position.y * DEFAULT_CONFIG.gridWidth + position.x;
    const cell = grid!.children[cellIndex];
    expect(cell.textContent).toBe("🍎");
  });

  it("ignores invalid positions", () => {
    renderer.renderEmoji({ x: -1, y: 0 }, "🐴");
    renderer.renderEmoji({ x: 0, y: -1 }, "🐴");
    renderer.renderEmoji({ x: DEFAULT_CONFIG.gridWidth, y: 0 }, "🐴");
    renderer.renderEmoji({ x: 0, y: DEFAULT_CONFIG.gridHeight }, "🐴");

    const grid = container.querySelector("div");
    const cells = Array.from(grid!.children);
    const allEmpty = cells.every((cell) => cell.textContent === "");
    expect(allEmpty).toBe(true);
  });
});
