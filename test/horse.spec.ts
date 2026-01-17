import { describe, it, expect } from "vitest";
import { Herd } from "../src/horse";
import { DEFAULT_CONFIG } from "../src/types";

describe("Herd", () => {
  describe("peekNextHead", () => {
    it("returns next position without moving", () => {
      const herd = new Herd({ x: 5, y: 5 });

      const next = herd.peekNextHead("right");
      expect(next).toEqual({ x: 6, y: 5 });

      // Head should not have moved
      expect(herd.getHead()).toEqual({ x: 5, y: 5 });
    });

    it("returns correct position for all directions", () => {
      const herd = new Herd({ x: 5, y: 5 });

      expect(herd.peekNextHead("up")).toEqual({ x: 5, y: 4 });
      expect(herd.peekNextHead("down")).toEqual({ x: 5, y: 6 });
      expect(herd.peekNextHead("left")).toEqual({ x: 4, y: 5 });
      expect(herd.peekNextHead("right")).toEqual({ x: 6, y: 5 });
    });
  });

  it("starts with one horse at the given position", () => {
    const herd = new Herd({ x: 5, y: 5 });
    expect(herd.size()).toBe(1);
    expect(herd.getHead()).toEqual({ x: 5, y: 5 });
  });

  it("moves in the specified direction", () => {
    const herd = new Herd({ x: 5, y: 5 });

    herd.move("right", DEFAULT_CONFIG);
    expect(herd.getHead()).toEqual({ x: 6, y: 5 });

    herd.move("down", DEFAULT_CONFIG);
    expect(herd.getHead()).toEqual({ x: 6, y: 6 });

    herd.move("left", DEFAULT_CONFIG);
    expect(herd.getHead()).toEqual({ x: 5, y: 6 });

    herd.move("up", DEFAULT_CONFIG);
    expect(herd.getHead()).toEqual({ x: 5, y: 5 });
  });

  it("does not move outside grid bounds", () => {
    const herd = new Herd({ x: 0, y: 0 });

    const movedLeft = herd.move("left", DEFAULT_CONFIG);
    expect(movedLeft).toBe(false);
    expect(herd.getHead()).toEqual({ x: 0, y: 0 });

    const movedUp = herd.move("up", DEFAULT_CONFIG);
    expect(movedUp).toBe(false);
    expect(herd.getHead()).toEqual({ x: 0, y: 0 });
  });

  it("does not move past right and bottom edges", () => {
    const herd = new Herd({
      x: DEFAULT_CONFIG.gridWidth - 1,
      y: DEFAULT_CONFIG.gridHeight - 1,
    });

    const movedRight = herd.move("right", DEFAULT_CONFIG);
    expect(movedRight).toBe(false);

    const movedDown = herd.move("down", DEFAULT_CONFIG);
    expect(movedDown).toBe(false);
  });

  it("grows when eating apple", () => {
    const herd = new Herd({ x: 5, y: 5 });
    expect(herd.size()).toBe(1);

    herd.grow("right", DEFAULT_CONFIG);
    expect(herd.size()).toBe(2);
    expect(herd.getHead()).toEqual({ x: 6, y: 5 });
  });

  it("maintains tail positions when growing", () => {
    const herd = new Herd({ x: 5, y: 5 });

    herd.grow("right", DEFAULT_CONFIG);
    herd.grow("right", DEFAULT_CONFIG);

    const positions = herd.getPositions();
    expect(positions).toEqual([
      { x: 7, y: 5 },
      { x: 6, y: 5 },
      { x: 5, y: 5 },
    ]);
  });

  it("moves as a snake - tail follows head", () => {
    const herd = new Herd({ x: 5, y: 5 });
    herd.grow("right", DEFAULT_CONFIG);
    herd.grow("right", DEFAULT_CONFIG);

    // Now at positions: [7,5], [6,5], [5,5]
    herd.move("down", DEFAULT_CONFIG);

    const positions = herd.getPositions();
    expect(positions).toEqual([
      { x: 7, y: 6 },
      { x: 7, y: 5 },
      { x: 6, y: 5 },
    ]);
  });
});
