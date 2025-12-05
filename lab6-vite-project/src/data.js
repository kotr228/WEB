// Модуль для роботи з даними (список нотаток)

let notes = [
  { id: 1, title: 'Перша нотатка', content: 'Це приклад нотатки', createdAt: new Date('2025-12-01') },
  { id: 2, title: 'Друга нотатка', content: 'Ще одна нотатка для прикладу', createdAt: new Date('2025-12-03') },
  { id: 3, title: 'Купити продукти', content: 'Молоко, хліб, яйця', createdAt: new Date('2025-12-05') }
];

let nextId = 4;

/**
 * Отримати всі нотатки
 * @returns {Array} масив нотаток
 */
export function getAllNotes() {
  return [...notes]; // Повертаємо копію для інкапсуляції
}

/**
 * Додати нову нотатку
 * @param {string} title - заголовок нотатки
 * @param {string} content - зміст нотатки
 * @returns {Object} створена нотатка
 */
export function addNote(title, content) {
  const newNote = {
    id: nextId++,
    title,
    content,
    createdAt: new Date()
  };
  notes.push(newNote);
  return newNote;
}

/**
 * Видалити нотатку за ID
 * @param {number} id - ID нотатки для видалення
 * @returns {boolean} успішність операції
 */
export function deleteNote(id) {
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== id);
  return notes.length < initialLength;
}

/**
 * Знайти нотатку за ID
 * @param {number} id - ID нотатки
 * @returns {Object|undefined} знайдена нотатка або undefined
 */
export function findNoteById(id) {
  return notes.find(note => note.id === id);
}

/**
 * Оновити нотатку
 * @param {number} id - ID нотатки
 * @param {Object} updates - об'єкт з оновленнями
 * @returns {Object|null} оновлена нотатка або null
 */
export function updateNote(id, updates) {
  const note = notes.find(n => n.id === id);
  if (note) {
    Object.assign(note, updates);
    return note;
  }
  return null;
}

/**
 * Пошук нотаток за ключовим словом
 * @param {string} keyword - ключове слово для пошуку
 * @returns {Array} знайдені нотатки
 */
export function searchNotes(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return notes.filter(note =>
    note.title.toLowerCase().includes(lowerKeyword) ||
    note.content.toLowerCase().includes(lowerKeyword)
  );
}
