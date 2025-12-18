/**
 * Завдання 2: Ланцюжок промісів для роботи з файлами
 *
 * Скрипт асинхронно читає файл, перетворює текст у верхній регістр,
 * і записує результат у новий файл, використовуючи ланцюжок промісів
 */

import fs from 'fs';

// Використовуємо fs.promises для роботи з промісами
const fsPromises = fs.promises;

/**
 * Ланцюжок промісів для обробки файлу
 */
function processFile() {
  const inputFile = 'input.txt';
  const outputFile = 'output.txt';

  console.log('='.repeat(60));
  console.log('Завдання 2: Ланцюжок промісів (читання → обробка → запис)');
  console.log('='.repeat(60));
  console.log();

  console.log(`📖 Крок 1: Читання файлу "${inputFile}"...`);

  // Починаємо ланцюжок з читання файлу
  fsPromises.readFile(inputFile, 'utf8')
    .then(data => {
      console.log(`✅ Файл прочитано успішно!`);
      console.log(`   Розмір: ${data.length} символів`);
      console.log();
      console.log('📝 Оригінальний текст:');
      console.log('-'.repeat(60));
      console.log(data);
      console.log('-'.repeat(60));
      console.log();

      // Крок 2: Перетворення у верхній регістр
      console.log('🔄 Крок 2: Перетворення тексту у ВЕРХНІЙ РЕГІСТР...');
      const upperCaseData = data.toUpperCase();
      console.log('✅ Текст перетворено!');
      console.log();

      // Повертаємо перетворені дані для наступного then
      return upperCaseData;
    })
    .then(upperCaseData => {
      // Крок 3: Запис у файл
      console.log(`💾 Крок 3: Запис результату у "${outputFile}"...`);
      return fsPromises.writeFile(outputFile, upperCaseData, 'utf8')
        .then(() => {
          // Повертаємо дані для відображення у наступному then
          return upperCaseData;
        });
    })
    .then(upperCaseData => {
      // Крок 4: Виведення результату
      console.log('✅ Файл записано успішно!');
      console.log();
      console.log('📝 Перетворений текст:');
      console.log('-'.repeat(60));
      console.log(upperCaseData);
      console.log('-'.repeat(60));
      console.log();
    })
    .catch(error => {
      // Обробка помилок на будь-якому етапі ланцюжка
      console.error('❌ Помилка при обробці файлу:');
      console.error(`   ${error.message}`);

      if (error.code === 'ENOENT') {
        console.error(`   Файл "${error.path}" не знайдено!`);
      }
    })
    .finally(() => {
      // Завжди виконується після завершення (успішного чи ні)
      console.log('='.repeat(60));
      console.log('🏁 Операція завершена!');
      console.log('='.repeat(60));
    });
}

// Запуск обробки
processFile();

// Експорт для використання в інших модулях
export { processFile };
