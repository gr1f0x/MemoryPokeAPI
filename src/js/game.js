import { getRandomPokemonIds, getPokemonImageUrl } from './pokeapi.js';

window.gameStart = 0;

const FLIP_DELAY = 1000;
const MAX_CARDS = 20;

let timer = null;
let flippedCards = [];
let matchedCount = 0;
let totalPairs = 0;
let isGameActive = false;

function showError(message) {
  const modal = document.getElementById('modal');
  modal.textContent = message;
  modal.showModal();
  setTimeout(() => modal.close(), 2000);
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function resetGame() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  matchedCount = 0;
  flippedCards = [];
  isGameActive = true;
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startTimer() {
  window.gameStart = Date.now();
  const timerElement = document.getElementById('timer');
  timerElement.textContent = '0m 0s';

  stopTimer();
  timer = setInterval(() => {
    if (!isGameActive) {
      stopTimer();
      return;
    }

    const elapsed = Math.floor((Date.now() - window.gameStart) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerElement.textContent = `${minutes}m ${seconds}s`;
  }, 1000);
}

function checkForMatch() {
  const [first, second] = flippedCards;
  const match = first.getAttribute('data-id') === second.getAttribute('data-id');

  if (match) {
    first.classList.add('matched');
    second.classList.add('matched');
    matchedCount += 1;
    flippedCards = [];

    if (matchedCount === totalPairs) {
      isGameActive = false;
      const totalTime = Math.floor((Date.now() - window.gameStart) / 1000);
      document.dispatchEvent(new CustomEvent('game-won', { detail: { time: totalTime } }));
    }
  } else {
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      first.style.backgroundImage = '';
      second.style.backgroundImage = '';
      flippedCards = [];
    }, FLIP_DELAY);
  }
}

function handleCardClick(event) {
  if (!isGameActive) return;

  const card = event.target;

  if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }

  card.classList.add('flipped');
  const pokemonId = card.getAttribute('data-id');
  card.style.backgroundImage = `url(${getPokemonImageUrl(pokemonId)})`;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function calculateGridColumns(cardCount) {
  if (cardCount <= 4) return 2;
  if (cardCount <= 9) return 3;
  if (cardCount <= 16) return 4;
  return Math.ceil(Math.sqrt(cardCount));
}

function createGameBoard(cardCount) {
  resetGame();
  totalPairs = cardCount / 2;

  const board = document.getElementById('game-board');
  const cols = calculateGridColumns(cardCount);
  board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

  try {
    const pokemonIds = getRandomPokemonIds(totalPairs);
    const allCards = [...pokemonIds, ...pokemonIds];
    const shuffledCards = shuffleArray(allCards);

    shuffledCards.forEach((id) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-id', id);
      card.addEventListener('click', handleCardClick);
      board.appendChild(card);
    });
  } catch (error) {
    showError('Error creating game board');
    isGameActive = false;
  }
}

function handleGameFormSubmit(event) {
  event.preventDefault();

  const input = document.getElementById('cards-number');
  const cardCount = parseInt(input.value, 10);

  if (!Number.isInteger(cardCount) || cardCount <= 0 || cardCount % 2 !== 0) {
    showError('El número de cartes ha de ser parell i positiu!');
    return;
  }

  if (cardCount > MAX_CARDS) {
    showError(`El número màxim de cartes és ${MAX_CARDS}!`);
    return;
  }

  const playBtn = document.getElementById('play-btn');
  playBtn.textContent = 'Tornar a jugar';

  stopTimer();
  startTimer();
  createGameBoard(cardCount);
}

export function initGame() {
  const form = document.getElementById('game-form');
  if (!form) return;

  form.addEventListener('submit', handleGameFormSubmit);
}
