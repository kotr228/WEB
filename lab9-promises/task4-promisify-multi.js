/**
 * Завдання 4: Промісіфікація функції з кількома результатами
 *
 * Створення функції promisifyMulti для промісіфікації callback-функцій,
 * які повертають кілька результатів
 */

/**
 * Оригінальна функція з callback, що повертає кілька результатів
 * Виконує математичні операції: суму, добуток та ділення
 *
 * @param {number} a - Перше число
 * @param {number} b - Друге число
 * @param {Function} callback - Callback у форматі (err, sum, product, quotient)
 */
function calculate(a, b, callback) {
  // Симулюємо асинхронну операцію
  setTimeout(() => {
    // Перевірка на ділення на нуль
    if (b === 0) {
      callback(new Error('Ділення на нуль неможливе!'));
      return;
    }

    const sum = a + b;
    const product = a * b;
    const quotient = a / b;

    // Викликаємо callback з результатами
    callback(null, sum, product, quotient);
  }, 100);
}

/**
 * Універсальна функція промісіфікації для функцій з кількома результатами
 *
 * @param {Function} fn - Функція для промісіфікації
 * @returns {Function} - Промісіфікована версія функції
 */
function promisifyMulti(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // Додаємо callback в кінець аргументів
      fn(...args, (err, ...results) => {
        if (err) {
          reject(err);
        } else {
          // Резолюємо проміс масивом усіх результатів
          resolve(results);
        }
      });
    });
  };
}

/**
 * Промісіфікована версія функції calculate
 */
const calculatePromise = promisifyMulti(calculate);

/**
 * Демонстрація роботи
 */
async function demo() {
  console.log('='.repeat(60));
  console.log('Завдання 4: Промісіфікація функції з кількома результатами');
  console.log('='.repeat(60));
  console.log();

  // Тест 1: Успішне виконання з позитивними числами
  console.log('📝 Тест 1: Обчислення для a=10, b=5');
  console.log('-'.repeat(60));

  try {
    const [sum, product, quotient] = await calculatePromise(10, 5);

    console.log('✅ Результати обчислень:');
    console.log(`   Сума (a + b): ${sum}`);
    console.log(`   Добуток (a × b): ${product}`);
    console.log(`   Частка (a ÷ b): ${quotient}`);
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
  }

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 2: Обчислення з від'ємними числами
  console.log('📝 Тест 2: Обчислення для a=-15, b=3');
  console.log('-'.repeat(60));

  try {
    const [sum, product, quotient] = await calculatePromise(-15, 3);

    console.log('✅ Результати обчислень:');
    console.log(`   Сума (a + b): ${sum}`);
    console.log(`   Добуток (a × b): ${product}`);
    console.log(`   Частка (a ÷ b): ${quotient.toFixed(2)}`);
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
  }

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 3: Обчислення з дробовими числами
  console.log('📝 Тест 3: Обчислення для a=7.5, b=2.5');
  console.log('-'.repeat(60));

  try {
    const [sum, product, quotient] = await calculatePromise(7.5, 2.5);

    console.log('✅ Результати обчислень:');
    console.log(`   Сума (a + b): ${sum}`);
    console.log(`   Добуток (a × b): ${product}`);
    console.log(`   Частка (a ÷ b): ${quotient}`);
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
  }

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 4: Обробка помилки - ділення на нуль
  console.log('📝 Тест 4: Обробка помилки (a=10, b=0)');
  console.log('-'.repeat(60));

  try {
    const [sum, product, quotient] = await calculatePromise(10, 0);

    console.log('✅ Результати обчислень:');
    console.log(`   Сума (a + b): ${sum}`);
    console.log(`   Добуток (a × b): ${product}`);
    console.log(`   Частка (a ÷ b): ${quotient}`);
  } catch (error) {
    console.error(`❌ Очікувана помилка оброблена: ${error.message}`);
  }

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 5: Паралельне виконання кількох обчислень
  console.log('📝 Тест 5: Паралельне виконання кількох обчислень');
  console.log('-'.repeat(60));

  try {
    const results = await Promise.all([
      calculatePromise(5, 3),
      calculatePromise(12, 4),
      calculatePromise(20, 10)
    ]);

    console.log('✅ Усі обчислення виконано:');
    results.forEach(([sum, product, quotient], index) => {
      console.log(`   Обчислення ${index + 1}:`);
      console.log(`      Сума: ${sum}, Добуток: ${product}, Частка: ${quotient}`);
    });
  } catch (error) {
    console.error(`❌ Помилка: ${error.message}`);
  }

  console.log();
  console.log('-'.repeat(60));
  console.log();

  // Тест 6: Promise.allSettled для обробки помилок
  console.log('📝 Тест 6: Promise.allSettled (з помилкою)');
  console.log('-'.repeat(60));

  const operations = await Promise.allSettled([
    calculatePromise(8, 2),
    calculatePromise(15, 0), // Помилка: ділення на нуль
    calculatePromise(6, 3)
  ]);

  operations.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const [sum, product, quotient] = result.value;
      console.log(`   ✅ Обчислення ${index + 1}: Сума=${sum}, Добуток=${product}, Частка=${quotient}`);
    } else {
      console.log(`   ❌ Обчислення ${index + 1}: ${result.reason.message}`);
    }
  });

  console.log();
  console.log('='.repeat(60));
  console.log('✅ Завдання 4 виконано!');
  console.log('='.repeat(60));
}

// Запуск демонстрації
demo();

// Експорт для використання в інших модулях
export { calculate, promisifyMulti, calculatePromise };
