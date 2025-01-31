import { handleRegister } from './register.js';
import { initGame } from './game.js';
import { initRanking } from './ranking.js';
import { initLogout } from './logout.js';

document.addEventListener('DOMContentLoaded', () => {
  const userId = sessionStorage.getItem('user');
  const formSection = document.getElementById('form-section');
  const gameDiv = document.getElementById('game');
  const userForm = document.getElementById('user-form');

  if (!userId) {
    formSection.style.display = 'block';
    gameDiv.style.display = 'none';

    userForm.addEventListener('submit', handleRegister);
  } else {
    formSection.style.display = 'none';
    gameDiv.style.display = 'flex';

    initGame();
    initRanking();
    initLogout();
  }
});
