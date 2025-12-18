/**
 * Завдання 1: Паралельне завантаження даних за допомогою Promise.all
 *
 * Функція fetchUserAndPosts паралельно завантажує дані про користувача
 * та його пости з сервісу JSONPlaceholder
 */

import https from 'https';

/**
 * Допоміжна функція для виконання HTTPS GET запиту
 * @param {string} url - URL для запиту
 * @returns {Promise<Object>} - Проміс з JSON даними
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      // Обробка помилок відповіді
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP Error: ${response.statusCode}`));
        response.resume(); // Споживаємо дані для звільнення пам'яті
        return;
      }

      // Збираємо дані
      response.on('data', (chunk) => {
        data += chunk;
      });

      // Парсимо JSON після завершення
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`JSON Parse Error: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Network Error: ${error.message}`));
    });
  });
}

/**
 * Паралельно завантажує дані користувача та його пости
 * @param {number} userId - ID користувача
 * @returns {Promise<{user: Object, posts: Array}>} - Об'єкт з даними користувача та постами
 */
async function fetchUserAndPosts(userId) {
  try {
    const userUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
    const postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

    console.log(`📡 Завантаження даних для користувача #${userId}...`);
    console.log(`   GET ${userUrl}`);
    console.log(`   GET ${postsUrl}`);

    // Використовуємо Promise.all для паралельного виконання запитів
    const [user, posts] = await Promise.all([
      httpsGet(userUrl),
      httpsGet(postsUrl)
    ]);

    console.log(`✅ Дані успішно завантажено!`);

    return { user, posts };
  } catch (error) {
    console.error(`❌ Помилка при завантаженні даних: ${error.message}`);
    throw error;
  }
}

/**
 * Демонстрація роботи функції
 */
async function demo() {
  console.log('='.repeat(60));
  console.log('Завдання 1: Паралельне завантаження даних (Promise.all)');
  console.log('='.repeat(60));
  console.log();

  try {
    // Тест 1: Завантаження даних для користувача #1
    const result1 = await fetchUserAndPosts(1);

    console.log();
    console.log('📊 Результат:');
    console.log(`   Користувач: ${result1.user.name} (${result1.user.email})`);
    console.log(`   Компанія: ${result1.user.company.name}`);
    console.log(`   Кількість постів: ${result1.posts.length}`);
    console.log();

    // Показуємо перші 3 пости
    console.log('   Перші 3 пости:');
    result1.posts.slice(0, 3).forEach((post, index) => {
      console.log(`   ${index + 1}. ${post.title}`);
    });

    console.log();
    console.log('-'.repeat(60));
    console.log();

    // Тест 2: Завантаження для іншого користувача
    const result2 = await fetchUserAndPosts(5);

    console.log();
    console.log('📊 Результат:');
    console.log(`   Користувач: ${result2.user.name} (${result2.user.email})`);
    console.log(`   Компанія: ${result2.user.company.name}`);
    console.log(`   Кількість постів: ${result2.posts.length}`);
    console.log();

    // Тест 3: Обробка помилок - неіснуючий користувач
    console.log('-'.repeat(60));
    console.log();
    console.log('🧪 Тест обробки помилок (неіснуючий користувач #999):');
    try {
      await fetchUserAndPosts(999);
    } catch (error) {
      console.log(`   ⚠️  Очікувана помилка оброблена: ${error.message}`);
    }

  } catch (error) {
    console.error('Критична помилка:', error);
  }

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Завдання 1 виконано!');
  console.log('='.repeat(60));
}

// Запуск демонстрації
demo();

// Експортуємо для використання в інших модулях
export { fetchUserAndPosts };
