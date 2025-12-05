# Менеджер Нотаток

Веб-застосунок для управління нотатками, створений з використанням Vite та Day.js.

## Опис проєкту

Цей застосунок створено як частину лабораторної роботи №6 "Робота з кодом у Bundler Vite". Він демонструє:
- Модульну архітектуру JavaScript
- Використання Vite для розробки та збірки
- Роботу зі сторонніми бібліотеками (Day.js)
- Принципи інкапсуляції та розділення відповідальності

## Функціональність

- 📝 Створення нових нотаток
- 🗑️ Видалення нотаток
- 📅 Автоматичне форматування дат (Day.js)
- 🔄 Миттєве оновлення (HMR)
- 🎨 Адаптивний дизайн
- 🌓 Підтримка темної та світлої теми

## Структура проєкту

```
lab6-vite-project/
├── src/
│   ├── main.js       # Точка входу застосунку
│   ├── data.js       # Модуль для роботи з даними
│   ├── ui.js         # Модуль для управління UI
│   ├── utils.js      # Допоміжні функції
│   └── style.css     # Стилі застосунку
├── public/           # Статичні файли
├── index.html        # HTML шаблон
├── vite.config.js    # Конфігурація Vite
└── package.json      # Залежності проєкту
```

## Модулі

### src/data.js

Модуль для роботи з даними нотаток. Забезпечує інкапсуляцію - прямий доступ до масиву обмежено.

**Експортовані функції:**

```javascript
getAllNotes()              // Отримати всі нотатки
addNote(title, content)    // Додати нову нотатку
deleteNote(id)             // Видалити нотатку
findNoteById(id)           // Знайти нотатку за ID
updateNote(id, updates)    // Оновити нотатку
searchNotes(keyword)       // Пошук за ключовим словом
```

**Структура даних:**

```javascript
{
  id: 1,
  title: "Заголовок нотатки",
  content: "Зміст нотатки",
  createdAt: Date
}
```

### src/ui.js

Модуль для управління DOM та відображенням інтерфейсу.

**Основні функції:**

```javascript
renderNotesList(notes)     // Генерація HTML для списку
updateNotesDisplay()       // Оновлення відображення
handleAddNote(event)       // Обробка додавання
showNotification(msg)      // Показ сповіщень
initUI()                   // Ініціалізація інтерфейсу
```

### src/utils.js

Модуль допоміжних функцій з використанням Day.js.

**Функції:**

```javascript
formatDate(date)           // Форматування дати
getRelativeTime(date)      // Відносний час ("2 год тому")
generateId()               // Генерація унікального ID
truncateText(text, max)    // Обрізання тексту
isNotEmpty(str)            // Перевірка на порожність
escapeHtml(str)            // Екранування HTML
```

**Використання Day.js:**

```javascript
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

dayjs.locale('uk');

// Форматування
dayjs(date).format('DD MMMM YYYY, HH:mm');
// Виведе: "05 грудня 2025, 14:30"
```

### src/main.js

Точка входу застосунку.

```javascript
import './style.css'
import { initUI } from './ui.js'

document.addEventListener('DOMContentLoaded', () => {
  initUI();
});
```

## Vite конфігурація

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

**Особливості:**
- Псевдоніми для зручного імпорту
- Порт dev-сервера: 3000
- Автоматичне відкриття браузера
- Генерація source maps

## Встановлення та запуск

### Встановлення залежностей

```bash
npm install
```

### Режим розробки

```bash
npm run dev
```

Запустить dev-сервер на `http://localhost:3000` з підтримкою HMR.

### Збірка для продакшену

```bash
npm run build
```

Результат збірки буде в папці `dist/`.

### Перегляд зібраного проєкту

```bash
npm run preview
```

## Залежності

### Основні

```json
{
  "dependencies": {
    "dayjs": "^1.11.10"
  }
}
```

### Для розробки

```json
{
  "devDependencies": {
    "vite": "^7.2.6"
  }
}
```

## Hot Module Replacement (HMR)

Vite підтримує HMR з коробки:

- Зміни в `.js` файлах оновлюються миттєво
- Зміни в `.css` застосовуються без перезавантаження
- Стан застосунку зберігається під час оновлення

## Особливості реалізації

### Інкапсуляція даних

Масив нотаток не експортується напряму:

```javascript
// ❌ Не можна
import { notes } from './data.js';

// ✅ Правильно
import { getAllNotes } from './data.js';
const notes = getAllNotes();
```

### Форматування дат

Використання Day.js з українською локалізацією:

```javascript
// Абсолютна дата
formatDate(new Date())
// "05 грудня 2025, 14:30"

// Відносний час
getRelativeTime(new Date(Date.now() - 3600000))
// "1 год тому"
```

### Безпека

Екранування HTML для запобігання XSS:

```javascript
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

## Стилі

### Адаптивність

Підтримка різних розмірів екранів через CSS Grid та Flexbox.

### Теми

Автоматична підтримка темної/світлої теми через media query:

```css
@media (prefers-color-scheme: light) {
  /* Світла тема */
}

@media (prefers-color-scheme: dark) {
  /* Темна тема */
}
```

### Анімації

- Плавні переходи
- Сповіщення з анімацією появи
- Hover ефекти на кнопках

## Збірка

### Аналіз результату

Після `npm run build`:

```
dist/
├── assets/
│   ├── index-[hash].js    # Бандл JS (мінімізований)
│   ├── vendor-[hash].js   # Залежності (Day.js)
│   └── index-[hash].css   # Стилі (мінімізовані)
├── index.html             # HTML (мінімізований)
└── vite.svg
```

### Оптимізації Vite

- Мінімізація коду
- Хешування файлів для кешування
- Розділення vendor-бандлу
- Tree-shaking неіспользуваного коду

## Pre-bundling

Vite автоматично "пре-бандлить" залежності:

```
node_modules/.vite/deps/
├── dayjs.js
└── package.json
```

Це прискорює завантаження в dev-режимі.

## Можливі покращення

- [ ] Редагування існуючих нотаток
- [ ] Пошук та фільтрація нотаток
- [ ] Категорії та теги
- [ ] Збереження в LocalStorage
- [ ] Експорт нотаток
- [ ] Markdown підтримка

## Контрольні запитання

### 1. Що таке Vite і які його дві основні частини?

Vite - це інструмент збірки нового покоління:
- **Dev-сервер** з нативними ES модулями та HMR
- **Команда збірки** на базі Rollup для продакшену

### 2. Що таке pre‑bundling у Vite?

Попередня обробка залежностей з `node_modules` для:
- Конвертації CommonJS в ES модулі
- Об'єднання багатьох модулів в один
- Кешування для швидшого перезавантаження

### 3. Що таке Hot Module Replacement (HMR)?

Технологія, що дозволяє оновлювати модулі без перезавантаження сторінки, зберігаючи стан застосунку.

### 4. Як створити проєкт Vite?

```bash
npm create vite@latest
# Обрати назву та шаблон
npm install
npm run dev
```

### 5. Що таке bare import?

Імпорт з назви пакету без шляху:

```javascript
import dayjs from 'dayjs'  // bare import
import { foo } from './foo.js'  // relative import
```

Потребує обробки, бо браузер не знає де знайти `dayjs`.

### 6. Навіщо потрібен vite.config.js?

Для налаштування:
- Псевдонімів імпорту
- Порту dev-сервера
- Плагінів
- Параметрів збірки

## Технології

- **Vite 7.2** - збиральник та dev-сервер
- **Day.js 1.11** - робота з датами
- **JavaScript ES6+** - модулі, стрілочні функції, деструктуризація
- **CSS3** - Grid, Flexbox, анімації
- **HTML5** - семантична розмітка

## Автор

Виконано як лабораторна робота №6 з курсу ООРВЗ

## Ліцензія

MIT
