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
    input.getDirection(); // consume to set current direction

    pressKey("ArrowLeft"); // opposite, should be ignored
    expect(input.getDirection()).toBe("right"); // still right
  });

  it("allows perpendicular direction change", () => {
    pressKey("ArrowRight");
    input.getDirection();

    pressKey("ArrowUp"); // perpendicular, should be allowed
    expect(input.getDirection()).toBe("up");
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
  });
});
