import "./style.css";
import { Game } from "./game";
import { DEFAULT_CONFIG, WIN_HERD_SIZE } from "./types";

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

// Instructions
const instructions = document.createElement("p");
instructions.className = "text-gray-400 text-sm";
instructions.textContent = "Use arrow keys, WASD, or swipe to move";
gameScreen.appendChild(instructions);

// Game container
const gameContainer = document.createElement("div");
gameScreen.appendChild(gameContainer);

// Victory screen (hidden initially)
const victoryScreen = document.createElement("div");
victoryScreen.className = "hidden flex flex-col items-center gap-6 text-center";
app.appendChild(victoryScreen);

const ringEmoji = document.createElement("div");
ringEmoji.className = "text-8xl animate-bounce";
ringEmoji.textContent = "💍";
victoryScreen.appendChild(ringEmoji);

const proposalMessage = document.createElement("h2");
proposalMessage.className = "text-4xl font-bold text-white";
proposalMessage.textContent = "Will you marry me?";
victoryScreen.appendChild(proposalMessage);

const replayButton = document.createElement("button");
replayButton.className =
  "mt-4 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors";
replayButton.textContent = "Play Again";
victoryScreen.appendChild(replayButton);

// Game setup
let game: Game;

function startGame(): void {
  gameContainer.innerHTML = "";
  game = new Game(gameContainer, DEFAULT_CONFIG);

  game.setOnStateChange((state) => {
    herdDisplay.textContent = `Herd: ${state.herdSize} / ${WIN_HERD_SIZE}`;
  });

  game.setOnWin(() => {
    gameScreen.classList.add("hidden");
    victoryScreen.classList.remove("hidden");
  });

  game.start();
}

replayButton.addEventListener("click", () => {
  victoryScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  herdDisplay.textContent = `Herd: 1 / ${WIN_HERD_SIZE}`;
  startGame();
});

// Start initial game
startGame();
