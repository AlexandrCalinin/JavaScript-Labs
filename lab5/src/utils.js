/**
 * Генерирует уникальный идентификатор транзакции.
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Форматирует дату в читаемом виде "YYYY-MM-DD HH:mm".
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

/**
 * Возвращает первые n слов строки.
 * @param {string} str
 * @param {number} n
 * @returns {string}
 */
export function shortDescription(str, n = 4) {
  return str.trim().split(/\s+/).slice(0, n).join(" ");
}
