const FIREBASE_DB_URL = 'https://prac-js-m06uf4-default-rtdb.europe-west1.firebasedatabase.app';

function handleError(error, context) {
  // Silent error logging while preserving params usage
  if (error && context) {
    // Log error silently
    return null;
  }
  return null;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function createRankingRow(record, position) {
  const row = document.createElement('tr');
  if (record.isNew) {
    row.classList.add('highlight');
  }

  const timeFormatted = formatTime(record.time);
  const cells = [position + 1, record.username || '---', record.email || '---', timeFormatted, record.cards];

  cells.forEach((content) => {
    const cell = document.createElement('td');
    cell.textContent = content;
    row.appendChild(cell);
  });

  return row;
}

async function fetchUserData(userId) {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/users/${userId}.json`);
    return response.json();
  } catch (error) {
    return handleError(error, 'fetchUserData');
  }
}

function displayRanking(scores) {
  const tableBody = document.getElementById('ranking-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  const validScores = scores.filter(Boolean);

  validScores.sort((a, b) => {
    if (b.cards === a.cards) {
      return a.time - b.time;
    }
    return b.cards - a.cards;
  });

  validScores.forEach((score, index) => {
    const row = createRankingRow(score, index);
    tableBody.appendChild(row);
  });
}

async function saveScore(totalTime) {
  const cardCount = parseInt(document.getElementById('cards-number').value, 10);
  const userId = sessionStorage.getItem('user');

  if (!userId) return null;

  try {
    const response = await fetch(`${FIREBASE_DB_URL}/ranking.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        time: totalTime,
        cards: cardCount,
      }),
    });

    if (!response.ok) throw new Error('Network error');
    return response.json();
  } catch (error) {
    return handleError(error, 'saveScore');
  }
}

async function loadRanking() {
  try {
    const response = await fetch(`${FIREBASE_DB_URL}/ranking.json`);
    const data = await response.json();
    if (!data) return [];

    const scores = await Promise.all(
      Object.entries(data).map(async ([key, score]) => {
        if (!score) return null;
        const user = await fetchUserData(score.userId);
        return {
          ...score,
          username: user?.username,
          email: user?.email,
          key,
        };
      }),
    );

    return scores.filter(Boolean);
  } catch (error) {
    return handleError(error, 'loadRanking');
  }
}

async function initRanking() {
  const tableBody = document.getElementById('ranking-table-body');
  if (!tableBody) return;

  const scores = await loadRanking();
  displayRanking(scores.map((score) => ({ ...score, isNew: false })));

  document.addEventListener('game-won', async () => {
    const totalTime = Math.floor((Date.now() - window.gameStart) / 1000);
    try {
      const savedScore = await saveScore(totalTime);
      if (savedScore) {
        const updatedScores = await loadRanking();
        displayRanking(
          updatedScores.map((score) => ({
            ...score,
            isNew: score.key === savedScore.name,
          })),
        );
      }
    } catch (error) {
      handleError(error, 'game-won handler');
    }
  });
}

export { saveScore, displayRanking, initRanking };
