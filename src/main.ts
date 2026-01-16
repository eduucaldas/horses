import "./style.css";
import { Renderer } from "./renderer";
import { DEFAULT_CONFIG } from "./types";
import type { Position } from "./types";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.className = "min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-4";

// Title
const title = document.createElement("h1");
title.className = "text-3xl font-bold text-white";
title.textContent = "Horses";
app.appendChild(title);

// Game container
const gameContainer = document.createElement("div");
app.appendChild(gameContainer);

// Create renderer
const renderer = new Renderer(gameContainer, DEFAULT_CONFIG);

// Initial positions
const horsePosition: Position = { x: 10, y: 7 };
const applePosition: Position = { x: 5, y: 5 };

// Render initial state
renderer.clear();
renderer.renderEmoji(horsePosition, "🐴");
renderer.renderEmoji(applePosition, "🍎");
