// Модуль для управління DOM та відображення інтерфейсу

import { formatDate, escapeHtml } from './utils.js';
import { getAllNotes, addNote, deleteNote } from './data.js';

/**
 * Генерувати HTML для списку нотаток
 * @param {Array} notes - масив нотаток
 * @returns {string} HTML-розмітка
 */
export function renderNotesList(notes) {
  if (notes.length === 0) {
    return '<p class="empty-message">Немає нотаток. Додайте першу нотатку!</p>';
  }

  return notes.map(note => `
    <div class="note-item" data-id="${note.id}">
      <div class="note-header">
        <h3>${escapeHtml(note.title)}</h3>
        <button class="delete-btn" data-id="${note.id}">✕</button>
      </div>
      <p class="note-content">${escapeHtml(note.content)}</p>
      <p class="note-date">${formatDate(note.createdAt)}</p>
    </div>
  `).join('');
}

/**
 * Оновити відображення списку нотаток
 */
export function updateNotesDisplay() {
  const notesContainer = document.querySelector('#notes-list');
  if (!notesContainer) return;

  const notes = getAllNotes();
  notesContainer.innerHTML = renderNotesList(notes);

  // Додаємо обробники для кнопок видалення
  const deleteButtons = notesContainer.querySelectorAll('.delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      handleDeleteNote(id);
    });
  });
}

/**
 * Обробити видалення нотатки
 * @param {number} id - ID нотатки
 */
function handleDeleteNote(id) {
  if (confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
    const success = deleteNote(id);
    if (success) {
      updateNotesDisplay();
      showNotification('Нотатку видалено!');
    }
  }
}

/**
 * Обробити додавання нової нотатки
 * @param {Event} event - подія submit форми
 */
export function handleAddNote(event) {
  event.preventDefault();

  const titleInput = document.querySelector('#note-title');
  const contentInput = document.querySelector('#note-content');

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    showNotification('Заповніть всі поля!', 'error');
    return;
  }

  addNote(title, content);
  titleInput.value = '';
  contentInput.value = '';
  updateNotesDisplay();
  showNotification('Нотатку додано!');
}

/**
 * Показати сповіщення
 * @param {string} message - текст повідомлення
 * @param {string} type - тип повідомлення ('success' або 'error')
 */
export function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/**
 * Ініціалізувати інтерфейс
 */
export function initUI() {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <div class="container">
      <h1>📝 Менеджер Нотаток</h1>

      <div class="add-note-section">
        <h2>Додати нову нотатку</h2>
        <form id="add-note-form">
          <input
            type="text"
            id="note-title"
            placeholder="Заголовок нотатки"
            required
          />
          <textarea
            id="note-content"
            placeholder="Зміст нотатки"
            rows="3"
            required
          ></textarea>
          <button type="submit" class="add-btn">Додати нотатку</button>
        </form>
      </div>

      <div class="notes-section">
        <h2>Мої нотатки</h2>
        <div id="notes-list"></div>
      </div>
    </div>
  `;

  // Додаємо обробник форми
  const form = document.querySelector('#add-note-form');
  form.addEventListener('submit', handleAddNote);

  // Відображаємо початковий список
  updateNotesDisplay();
}
