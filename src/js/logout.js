export function initLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('user');
    window.location.reload();
  });
}
