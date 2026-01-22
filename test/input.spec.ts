import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InputHandler } from "../src/input";

describe("InputHandler", () => {
  let input: InputHandler;

  beforeEach(() => {
    input = new InputHandler();
    input.start();
  });

  afterEach(() => {
    input.stop();
  });

  function pressKey(key: string): void {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
  }

  it("returns null when no key pressed", () => {
    expect(input.getDirection()).toBeNull();
  });

  it("returns up for ArrowUp", () => {
    pressKey("ArrowUp");
    expect(input.getDirection()).toBe("up");
  });

  it("returns down for ArrowDown", () => {
    pressKey("ArrowDown");
    expect(input.getDirection()).toBe("down");
  });

  it("returns left for ArrowLeft", () => {
    pressKey("ArrowLeft");
    expect(input.getDirection()).toBe("left");
  });

  it("returns right for ArrowRight", () => {
    pressKey("ArrowRight");
    expect(input.getDirection()).toBe("right");
  });

  it("returns direction for WASD keys", () => {
    pressKey("w");
    expect(input.getDirection()).toBe("up");
  });

  it("returns direction for lowercase wasd", () => {
    pressKey("d");
    expect(input.getDirection()).toBe("right");
  });

  it("ignores opposite direction", () => {
    pressKey("ArrowRight");
    input.getDirection();
    input.setCurrentDirection("right"); // simulate successful move

    pressKey("ArrowLeft"); // opposite, should be ignored
    expect(input.getDirection()).toBe("right"); // still right
  });

  it("allows perpendicular direction change", () => {
    pressKey("ArrowRight");
    input.getDirection();
    input.setCurrentDirection("right"); // confirm the move succeeded

    pressKey("ArrowUp"); // perpendicular, should be allowed
    expect(input.getDirection()).toBe("up");
  });

  describe("direction sync with failed moves", () => {
    it("allows opposite of failed direction when actual direction differs", () => {
      // Scenario: horse going up, hits corner, user presses right (fails), then left
      input.setCurrentDirection("up"); // actual direction is up

      pressKey("ArrowRight"); // user tries to go right
      input.getDirection(); // game gets "right" but move will fail
      // Note: setCurrentDirection NOT called because move failed

      pressKey("ArrowLeft"); // user now tries left
      // Left is NOT opposite to actual direction (up), so should be allowed
      expect(input.getDirection()).toBe("left");
    });

    it("still blocks true opposite direction", () => {
      input.setCurrentDirection("up");

      pressKey("ArrowDown"); // opposite of actual direction
      expect(input.getDirection()).toBe("up"); // blocked, returns current
    });
  });

  it("ignores unrelated keys", () => {
    pressKey("Space");
    expect(input.getDirection()).toBeNull();

    pressKey("Enter");
    expect(input.getDirection()).toBeNull();
  });

  describe("swipe controls", () => {
    function swipe(startX: number, startY: number, endX: number, endY: number): void {
      window.dispatchEvent(
        new TouchEvent("touchstart", {
          touches: [{ clientX: startX, clientY: startY } as Touch],
        })
      );
      window.dispatchEvent(
        new TouchEvent("touchend", {
          changedTouches: [{ clientX: endX, clientY: endY } as Touch],
        })
      );
    }

    it("detects swipe right", () => {
      swipe(0, 0, 50, 0);
      expect(input.getDirection()).toBe("right");
    });

    it("detects swipe left", () => {
      swipe(50, 0, 0, 0);
      expect(input.getDirection()).toBe("left");
    });

    it("detects swipe down", () => {
      swipe(0, 0, 0, 50);
      expect(input.getDirection()).toBe("down");
    });

    it("detects swipe up", () => {
      swipe(0, 50, 0, 0);
      expect(input.getDirection()).toBe("up");
    });

    it("ignores small movements", () => {
      swipe(0, 0, 10, 10);
      expect(input.getDirection()).toBeNull();
    });

    it("detects diagonal swipe as down when vertical is dominant", () => {
      swipe(0, 0, 30, 40);
      expect(input.getDirection()).toBe("down");
    });

    it("detects diagonal swipe as right when horizontal is dominant", () => {
      swipe(0, 0, 50, 30);
      expect(input.getDirection()).toBe("right");
    });

    it("detects diagonal swipe as up-left correctly", () => {
      swipe(50, 60, 10, 0);
      expect(input.getDirection()).toBe("up"); // vertical (60) > horizontal (40)
    });

    it("detects diagonal swipe as left when horizontal is dominant", () => {
      swipe(100, 50, 0, 30);
      expect(input.getDirection()).toBe("left"); // horizontal (100) > vertical (20)
    });
  });
});
