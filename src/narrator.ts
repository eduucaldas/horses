export type EffectType =
  | "none"
  | "invert_controls"
  | "normal_controls"
  | "speed_2x"
  | "speed_half"
  | "speed_normal"
  | "speed_oscillate"
  | "apple_to_coffee"
  | "screen_shake"
  | "wrap_walls"
  | "add_flowers"
  | "zoom_out_1"
  | "zoom_out_2"
  | "fade_to_end";

export interface NarratorLine {
  text: string;
  effect: EffectType;
}

export const NARRATOR_SCRIPT: NarratorLine[] = [
  { text: "Sometimes it's confusing", effect: "invert_controls" },
  {
    text: "But suddenly you get used to the quirks of the other, and it feels all natural again...",
    effect: "normal_controls",
  },
  { text: "Except..", effect: "none" },
  { text: "Could we walk faster?", effect: "speed_2x" },
  { text: "Could we walk slowlier?", effect: "speed_half" },
  { text: "Until we meet on the middle", effect: "speed_normal" },
  { text: "Or not…", effect: "speed_oscillate" },
  { text: "But with little acts we show our love", effect: "apple_to_coffee" },
  { text: "Crisis might occur", effect: "screen_shake" },
  {
    text: "And we need to think outside of the box",
    effect: "wrap_walls",
  },
  { text: "And we see the beauty in all of it!", effect: "add_flowers" },
  {
    text: "Ok, by now this all might feel endless,",
    effect: "zoom_out_1",
  },
  {
    text: "and you may be starting to doubt this game will ever end…",
    effect: "zoom_out_2",
  },
  { text: "Doubt comes", effect: "fade_to_end" },
];

export class Narrator {
  private currentIndex = -1;
  private onLineChange: ((line: NarratorLine | null) => void) | null = null;

  setOnLineChange(callback: (line: NarratorLine | null) => void): void {
    this.onLineChange = callback;
  }

  advance(): NarratorLine | null {
    this.currentIndex++;

    if (this.currentIndex >= NARRATOR_SCRIPT.length) {
      return null; // Story is complete
    }

    const line = NARRATOR_SCRIPT[this.currentIndex];
    if (this.onLineChange) {
      this.onLineChange(line);
    }
    return line;
  }

  getCurrentLine(): NarratorLine | null {
    if (this.currentIndex < 0 || this.currentIndex >= NARRATOR_SCRIPT.length) {
      return null;
    }
    return NARRATOR_SCRIPT[this.currentIndex];
  }

  isComplete(): boolean {
    return this.currentIndex >= NARRATOR_SCRIPT.length - 1;
  }

  reset(): void {
    this.currentIndex = -1;
    if (this.onLineChange) {
      this.onLineChange(null);
    }
  }
}
