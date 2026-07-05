/**
 * Date utility functions for the Family Organizer app.
 */

function formatDateFr(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function changeDay(currentDate, delta) {
  const d = new Date(currentDate + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  const newDate = d.toISOString().slice(0, 10);
  if (newDate > getTodayStr()) return currentDate; // no future dates
  return newDate;
}

function getDurationMinutes(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

module.exports = {
  formatDateFr,
  getTodayStr,
  changeDay,
  getDurationMinutes,
  getCurrentTime
};
