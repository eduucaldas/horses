import "./style.css";
import { Game } from "./game";
import { DEFAULT_CONFIG, WIN_HERD_SIZE } from "./types";
import { Narrator } from "./narrator";
import type { EffectType } from "./narrator";

const app = document.querySelector<HTMLDivElement>("#app")!;
app.className =
  "min-h-screen flex flex-col items-center justify-center bg-gray-900 gap-4";

// Game screen elements
const gameScreen = document.createElement("div");
gameScreen.className = "flex flex-col items-center gap-4";
app.appendChild(gameScreen);

// Title
const title = document.createElement("h1");
title.className = "text-3xl font-bold text-white";
title.textContent = "Horses";
gameScreen.appendChild(title);

// Herd size display
const herdDisplay = document.createElement("p");
herdDisplay.className = "text-xl text-white";
herdDisplay.textContent = `Herd: 1 / ${WIN_HERD_SIZE}`;
gameScreen.appendChild(herdDisplay);

// Instructions - show mobile-friendly text on touch devices
const instructions = document.createElement("p");
instructions.className = "text-gray-400 text-sm";
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
instructions.textContent = isTouchDevice ? "Swipe to move" : "Use arrow keys or WASD to move";
gameScreen.appendChild(instructions);

// Narrator display
const narratorDisplay = document.createElement("p");
narratorDisplay.className = "text-yellow-300 text-lg italic min-h-8 text-center px-4 max-w-full sm:max-w-md";
narratorDisplay.textContent = "";
gameScreen.appendChild(narratorDisplay);

// Game container (with wrapper for visual effects)
const gameWrapper = document.createElement("div");
gameWrapper.className = "relative";
gameScreen.appendChild(gameWrapper);

const gameContainer = document.createElement("div");
gameWrapper.appendChild(gameContainer);

// Flowers container (for add_flowers effect)
const flowersContainer = document.createElement("div");
flowersContainer.className = "absolute inset-0 pointer-events-none overflow-hidden";
gameWrapper.appendChild(flowersContainer);

// Visual effect state
let zoomLevel = 1;

// Audio for the song (use base URL for GitHub Pages compatibility)
const loviSong = new Audio(`${import.meta.env.BASE_URL}lovi-lovi-song.m4a`);
loviSong.loop = true;

function applyVisualEffect(effect: EffectType): void {
  // Stop any ongoing shake
  gameWrapper.classList.remove("shake");

  switch (effect) {
    case "play_song":
      loviSong.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
      break;
    case "stop_song":
      loviSong.pause();
      loviSong.currentTime = 0;
      break;
    case "screen_shake":
      gameWrapper.classList.add("shake");
      break;
    case "add_flowers":
      addFlowers();
      break;
    case "zoom_out_1":
      zoomLevel = 0.7;
      applyZoom();
      break;
    case "zoom_out_2":
      zoomLevel = 0.4;
      applyZoom();
      break;
    case "fade_to_end":
      fadeToEnd();
      break;
  }
}

function addFlowers(): void {
  const flowers = ["🌸", "🌺", "🌻", "🌷", "🌼", "💐"];
  for (let i = 0; i < 20; i++) {
    const flower = document.createElement("div");
    flower.className = "absolute text-2xl";
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = `${Math.random() * 100}%`;
    flower.style.top = `${Math.random() * 100}%`;
    flowersContainer.appendChild(flower);
  }
}

function applyZoom(): void {
  gameWrapper.style.transform = `scale(${zoomLevel})`;
  gameWrapper.style.transition = "transform 1s ease-out";
}

function fadeToEnd(): void {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.className = "fixed inset-0 bg-black z-50";
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 3s ease-out";
  document.body.appendChild(overlay);

  // Start fade
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  // After fade completes, redirect
  setTimeout(() => {
    window.location.href = "https://eduucaldas.github.io/pov/";
  }, 5000);
}

// Game setup
let game: Game;
let narrator: Narrator;

function startGame(): void {
  gameContainer.innerHTML = "";
  game = new Game(gameContainer, DEFAULT_CONFIG);
  narrator = new Narrator();

  narrator.setOnLineChange((line) => {
    narratorDisplay.textContent = line ? line.text : "";
  });

  game.setOnStateChange((state) => {
    herdDisplay.textContent = `Herd: ${state.herdSize} / ${WIN_HERD_SIZE}`;
  });

  game.setOnAppleEaten(() => {
    const line = narrator.advance();
    if (line) {
      game.applyEffect(line.effect);
      applyVisualEffect(line.effect);
    }
  });

  game.start();
}

// Start initial game
startGame();
