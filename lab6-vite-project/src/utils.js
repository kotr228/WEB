// Модуль допоміжних функцій
import dayjs from 'dayjs';
import 'dayjs/locale/uk'; // Українська локалізація

// Встановлюємо українську локаль
dayjs.locale('uk');

/**
 * Форматувати дату у читабельний формат за допомогою Day.js
 * @param {Date} date - дата для форматування
 * @returns {string} відформатована дата
 */
export function formatDate(date) {
  return dayjs(date).format('DD MMMM YYYY, HH:mm');
}

/**
 * Отримати відносний час (наприклад, "2 години тому")
 * @param {Date} date - дата
 * @returns {string} відносний час
 */
export function getRelativeTime(date) {
  const now = dayjs();
  const target = dayjs(date);
  const diffInMinutes = now.diff(target, 'minute');
  const diffInHours = now.diff(target, 'hour');
  const diffInDays = now.diff(target, 'day');

  if (diffInMinutes < 1) return 'щойно';
  if (diffInMinutes < 60) return `${diffInMinutes} хв тому`;
  if (diffInHours < 24) return `${diffInHours} год тому`;
  if (diffInDays < 7) return `${diffInDays} дн тому`;
  return formatDate(date);
}

/**
 * Генерувати унікальний ID
 * @returns {string} унікальний ідентифікатор
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Скоротити текст до вказаної довжини
 * @param {string} text - текст для скорочення
 * @param {number} maxLength - максимальна довжина
 * @returns {string} скорочений текст
 */
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Перевірити, чи рядок не порожній
 * @param {string} str - рядок для перевірки
 * @returns {boolean} результат перевірки
 */
export function isNotEmpty(str) {
  return str && str.trim().length > 0;
}

/**
 * Екранувати HTML символи для безпеки
 * @param {string} str - рядок для екранування
 * @returns {string} екранований рядок
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
