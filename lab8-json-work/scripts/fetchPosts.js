#!/usr/bin/env node

/**
 * Завдання 3: Завантаження даних з API та збереження в JSON
 * Скрипт для завантаження постів з JSONPlaceholder та фільтрації за userId
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Шляхи до файлів
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'user_posts.json');

// API endpoint
const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// ID користувача для фільтрації
const USER_ID = 5;

/**
 * Завантаження даних з API за допомогою https
 */
function fetchPosts() {
  return new Promise((resolve, reject) => {
    console.log(`🌐 Завантаження постів з ${API_URL}...`);

    https.get(API_URL, (response) => {
      let data = '';

      // Збираємо дані
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Завершення завантаження
      response.on('end', () => {
        try {
          const posts = JSON.parse(data);
          console.log(`✓ Завантажено ${posts.length} постів\n`);
          resolve(posts);
        } catch (error) {
          reject(new Error(`Помилка парсингу JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Помилка запиту: ${error.message}`));
    });
  });
}

/**
 * Фільтрація постів за userId
 */
function filterByUser(posts, userId) {
  return posts.filter(post => post.userId === userId);
}

/**
 * Збереження даних у JSON файл
 */
function saveToJSON(data, filePath) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`\n✓ Дані збережено у файл ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Помилка запису файлу:`, error.message);
  }
}

/**
 * Відображення інформації про пост
 */
function displayPost(post, index) {
  console.log(`\n━━━ Пост ${index + 1} ━━━`);
  console.log(`ID: ${post.id}`);
  console.log(`User ID: ${post.userId}`);
  console.log(`Заголовок: ${post.title}`);
  console.log(`\nОпис:`);
  console.log(post.body);
}

/**
 * Статистика про пости
 */
function displayStatistics(posts) {
  console.log('\n📊 Статистика:\n');

  const avgTitleLength = posts.reduce((sum, p) => sum + p.title.length, 0) / posts.length;
  const avgBodyLength = posts.reduce((sum, p) => sum + p.body.length, 0) / posts.length;
  const longestTitle = posts.reduce((max, p) => p.title.length > max.title.length ? p : max, posts[0]);
  const shortestTitle = posts.reduce((min, p) => p.title.length < min.title.length ? p : min, posts[0]);

  console.log(`   Всього постів: ${posts.length}`);
  console.log(`   Середня довжина заголовка: ${avgTitleLength.toFixed(1)} символів`);
  console.log(`   Середня довжина тексту: ${avgBodyLength.toFixed(1)} символів`);
  console.log(`   Найдовший заголовок: "${longestTitle.title}" (${longestTitle.title.length} символів)`);
  console.log(`   Найкоротший заголовок: "${shortestTitle.title}" (${shortestTitle.title.length} символів)`);
}

/**
 * Головна функція
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  Завантаження постів з JSONPlaceholder API                ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Завантажуємо всі пости
  const allPosts = await fetchPosts();

  if (allPosts.length === 0) {
    console.log('❌ Не вдалося завантажити дані');
    return;
  }

  // Фільтруємо за userId
  console.log(`🔍 Фільтрація постів для користувача з ID = ${USER_ID}...`);
  const userPosts = filterByUser(allPosts, USER_ID);
  console.log(`✓ Знайдено ${userPosts.length} постів\n`);

  // Виводимо пости
  console.log('═'.repeat(60));
  console.log('ПОСТИ КОРИСТУВАЧА');
  console.log('═'.repeat(60));

  userPosts.forEach((post, index) => {
    displayPost(post, index);
  });

  console.log('\n' + '═'.repeat(60));

  // Статистика
  displayStatistics(userPosts);

  // Зберігаємо у файл
  saveToJSON(userPosts, OUTPUT_FILE);

  console.log('\n✅ Завдання виконано!\n');
}

// Запуск програми
main().catch(error => {
  console.error('Критична помилка:', error);
  process.exit(1);
});
