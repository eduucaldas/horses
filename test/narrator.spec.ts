import { describe, it, expect, vi } from "vitest";
import { Narrator, NARRATOR_SCRIPT } from "../src/narrator";

describe("Narrator", () => {
  it("starts with no current line", () => {
    const narrator = new Narrator();
    expect(narrator.getCurrentLine()).toBe(null);
  });

  it("advances to first line on first advance", () => {
    const narrator = new Narrator();
    const line = narrator.advance();

    expect(line).toEqual(NARRATOR_SCRIPT[0]);
    expect(narrator.getCurrentLine()).toEqual(NARRATOR_SCRIPT[0]);
  });

  it("advances through all lines in order", () => {
    const narrator = new Narrator();

    for (let i = 0; i < NARRATOR_SCRIPT.length; i++) {
      const line = narrator.advance();
      expect(line).toEqual(NARRATOR_SCRIPT[i]);
    }
  });

  it("returns null when script is complete", () => {
    const narrator = new Narrator();

    // Advance through all lines
    for (let i = 0; i < NARRATOR_SCRIPT.length; i++) {
      narrator.advance();
    }

    // Next advance should return null
    expect(narrator.advance()).toBe(null);
  });

  it("isComplete returns false initially", () => {
    const narrator = new Narrator();
    expect(narrator.isComplete()).toBe(false);
  });

  it("isComplete returns true after all lines consumed", () => {
    const narrator = new Narrator();

    for (let i = 0; i < NARRATOR_SCRIPT.length; i++) {
      narrator.advance();
    }

    expect(narrator.isComplete()).toBe(true);
  });

  it("reset returns to initial state", () => {
    const narrator = new Narrator();

    narrator.advance();
    narrator.advance();
    narrator.reset();

    expect(narrator.getCurrentLine()).toBe(null);
    expect(narrator.isComplete()).toBe(false);
  });

  it("calls onLineChange callback when advancing", () => {
    const narrator = new Narrator();
    const callback = vi.fn();
    narrator.setOnLineChange(callback);

    narrator.advance();

    expect(callback).toHaveBeenCalledWith(NARRATOR_SCRIPT[0]);
  });

  it("calls onLineChange with null on reset", () => {
    const narrator = new Narrator();
    const callback = vi.fn();
    narrator.setOnLineChange(callback);

    narrator.advance();
    callback.mockClear();
    narrator.reset();

    expect(callback).toHaveBeenCalledWith(null);
  });

  describe("NARRATOR_SCRIPT", () => {
    it("has 14 lines", () => {
      expect(NARRATOR_SCRIPT.length).toBe(14);
    });

    it("each line has text and effect", () => {
      for (const line of NARRATOR_SCRIPT) {
        expect(typeof line.text).toBe("string");
        expect(line.text.length).toBeGreaterThan(0);
        expect(typeof line.effect).toBe("string");
      }
    });

    it("first effect is invert_controls", () => {
      expect(NARRATOR_SCRIPT[0].effect).toBe("invert_controls");
    });

    it("last effect is fade_to_end", () => {
      expect(NARRATOR_SCRIPT[NARRATOR_SCRIPT.length - 1].effect).toBe("fade_to_end");
    });
  });
});
