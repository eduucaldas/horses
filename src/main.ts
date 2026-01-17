import "./style.css";
import { Game } from "./game";
import { DEFAULT_CONFIG } from "./types";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.className =
  "min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-4";

// Title
const title = document.createElement("h1");
title.className = "text-3xl font-bold text-white";
title.textContent = "Horses";
app.appendChild(title);

// Herd size display
const herdDisplay = document.createElement("p");
herdDisplay.className = "text-xl text-white";
herdDisplay.textContent = "Herd: 1 / 10";
app.appendChild(herdDisplay);

// Instructions
const instructions = document.createElement("p");
instructions.className = "text-gray-400 text-sm";
instructions.textContent = "Use arrow keys or WASD to move";
app.appendChild(instructions);

// Game container
const gameContainer = document.createElement("div");
app.appendChild(gameContainer);

// Start game
const game = new Game(gameContainer, DEFAULT_CONFIG);

game.setOnStateChange((state) => {
  herdDisplay.textContent = `Herd: ${state.herdSize} / 10`;
});

game.start();
