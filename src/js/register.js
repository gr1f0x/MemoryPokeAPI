const FIREBASE_DB_URL = 'https://prac-js-m06uf4-default-rtdb.europe-west1.firebasedatabase.app';

export async function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!username || !email) {
    alert('Falten dades!');
    return;
  }

  try {
    const res = await fetch(`${FIREBASE_DB_URL}/users.json`);
    const data = await res.json() || {};

    let userId = null;
    for (const [key, user] of Object.entries(data)) {
      if (user.email === email) {
        userId = key;
        break;
      }
    }

    if (userId) {
      await fetch(`${FIREBASE_DB_URL}/users/${userId}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      sessionStorage.setItem('user', userId);
    } else {
      const newUser = { username, email };
      const createRes = await fetch(`${FIREBASE_DB_URL}/users.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const createData = await createRes.json();
      sessionStorage.setItem('user', createData.name);
    }

    window.location.reload();
  } catch (error) {
    alert('Error en el registro');
  }
}
