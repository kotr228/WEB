/**
 * Завдання 3: Промісіфікація функції з callback
 *
 * Створення проміс-орієнтованої версії функції delay
 * та демонстрація використання util.promisify()
 */

import { promisify } from 'util';

/**
 * Оригінальна функція з callback
 * Викликає callback після затримки ms мілісекунд
 *
 * @param {number} ms - Затримка в мілісекундах
 * @param {Function} callback - Функція для виклику після затримки
 */
function delay(ms, callback) {
  setTimeout(() => {
    callback();
  }, ms);
}

/**
 * Проміс-орієнтована версія delay (ручна промісіфікація)
 * Повертає проміс, що виконується після затримки
 *
 * @param {number} ms - Затримка в мілісекундах
 * @returns {Promise<void>} - Проміс, що резолюється після затримки
 */
function delayPromise(ms) {
  return new Promise((resolve) => {
    delay(ms, resolve);
  });
}

/**
 * Виводить текст з затримкою (ручна промісіфікація)
 *
 * @param {string} text - Текст для виведення
 * @param {number} ms - Затримка в мілісекундах
 * @returns {Promise<void>}
 */
async function printWithDelay(text, ms) {
  console.log(`⏳ Очікування ${ms}мс перед виведенням...`);
  await delayPromise(ms);
  console.log(`✅ ${text}`);
}

/**
 * Проміс-версія через util.promisify()
 */
const delayPromisified = promisify(delay);

/**
 * Виводить текст з затримкою (через util.promisify)
 *
 * @param {string} text - Текст для виведення
 * @param {number} ms - Затримка в мілісекундах
 * @returns {Promise<void>}
 */
async function printWithDelayPromisified(text, ms) {
  console.log(`⏳ Очікування ${ms}мс перед виведенням...`);
  await delayPromisified(ms);
  console.log(`✅ ${text}`);
}

/**
 * Демонстрація роботи промісіфікації
 */
async function demo() {
  console.log('='.repeat(60));
  console.log('Завдання 3: Промісіфікація функції delay');
  console.log('='.repeat(60));
  console.log();

  // Тест 1: Ручна промісіфікація
  console.log('📝 Тест 1: Ручна промісіфікація (delayPromise)');
  console.log('-'.repeat(60));

  await printWithDelay('Перше повідомлення (затримка 1000мс)', 1000);
  await printWithDelay('Друге повідомлення (затримка 500мс)', 500);
  await printWithDelay('Третє повідомлення (затримка 300мс)', 300);

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 2: Промісіфікація через util.promisify
  console.log('📝 Тест 2: Промісіфікація через util.promisify()');
  console.log('-'.repeat(60));

  await printWithDelayPromisified('Перше повідомлення (затримка 800мс)', 800);
  await printWithDelayPromisified('Друге повідомлення (затримка 400мс)', 400);
  await printWithDelayPromisified('Третє повідомлення (затримка 200мс)', 200);

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 3: Паралельне виконання кількох затримок
  console.log('📝 Тест 3: Паралельне виконання затримок (Promise.all)');
  console.log('-'.repeat(60));
  console.log('⏳ Запуск 3 паралельних затримок...');

  const startTime = Date.now();

  await Promise.all([
    delayPromise(1000).then(() => console.log('   ✅ Затримка 1000мс завершена')),
    delayPromise(800).then(() => console.log('   ✅ Затримка 800мс завершена')),
    delayPromise(600).then(() => console.log('   ✅ Затримка 600мс завершена'))
  ]);

  const endTime = Date.now();
  const totalTime = endTime - startTime;

  console.log(`   🏁 Усі затримки завершені за ${totalTime}мс`);
  console.log(`   💡 Паралельне виконання: очікуваний час ≈ 1000мс (найдовша затримка)`);

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 4: Послідовне виконання
  console.log('📝 Тест 4: Послідовне виконання затримок');
  console.log('-'.repeat(60));
  console.log('⏳ Запуск 3 послідовних затримок...');

  const startTime2 = Date.now();

  await delayPromise(500).then(() => console.log('   ✅ Затримка 1: 500мс завершена'));
  await delayPromise(300).then(() => console.log('   ✅ Затримка 2: 300мс завершена'));
  await delayPromise(200).then(() => console.log('   ✅ Затримка 3: 200мс завершена'));

  const endTime2 = Date.now();
  const totalTime2 = endTime2 - startTime2;

  console.log(`   🏁 Усі затримки завершені за ${totalTime2}мс`);
  console.log(`   💡 Послідовне виконання: очікуваний час ≈ ${500 + 300 + 200}мс (сума всіх затримок)`);

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Завдання 3 виконано!');
  console.log('='.repeat(60));
}

// Запуск демонстрації
demo();

// Експорт для використання в інших модулях
export { delay, delayPromise, printWithDelay, delayPromisified, printWithDelayPromisified };
