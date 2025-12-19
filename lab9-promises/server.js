/**
 * Express сервер для лабораторної роботи №9
 * Обробка промісів та промісіфікація
 */

import express from 'express';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// =================================================================
// Завдання 1: Паралельне завантаження даних (Promise.all)
// =================================================================

/**
 * Допоміжна функція для HTTPS GET запиту
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP Error: ${response.statusCode}`));
        response.resume();
        return;
      }

      response.on('data', (chunk) => {
        data += chunk;
      });

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
 * API: Завантаження користувача та його постів
 */
app.get('/api/task1/fetch-user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (!userId || userId < 1 || userId > 10) {
      return res.status(400).json({
        success: false,
        error: 'User ID має бути від 1 до 10'
      });
    }

    const userUrl = `https://jsonplaceholder.typicode.com/users/${userId}`;
    const postsUrl = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;

    // Promise.all для паралельного виконання
    const [user, posts] = await Promise.all([
      httpsGet(userUrl),
      httpsGet(postsUrl)
    ]);

    res.json({
      success: true,
      user,
      posts,
      stats: {
        postsCount: posts.length,
        userId: userId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =================================================================
// Завдання 2: Ланцюжок промісів для файлів
// =================================================================

const fsPromises = fs.promises;

/**
 * API: Обробка тексту (читання → перетворення → запис)
 */
app.post('/api/task2/process-text', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Текст не може бути порожнім'
      });
    }

    const inputFile = 'input.txt';
    const outputFile = 'output.txt';

    // Ланцюжок промісів
    await fsPromises.writeFile(inputFile, text, 'utf8')
      .then(() => fsPromises.readFile(inputFile, 'utf8'))
      .then(data => {
        const upperCaseData = data.toUpperCase();
        return fsPromises.writeFile(outputFile, upperCaseData, 'utf8')
          .then(() => upperCaseData);
      })
      .then(upperCaseData => {
        res.json({
          success: true,
          original: text,
          transformed: upperCaseData,
          message: 'Текст успішно оброблено'
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * API: Читання вихідного файлу
 */
app.get('/api/task2/read-output', async (req, res) => {
  try {
    const data = await fsPromises.readFile('output.txt', 'utf8');
    res.json({
      success: true,
      content: data
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Файл не знайдено. Спочатку обробіть текст.'
    });
  }
});

// =================================================================
// Завдання 3: Промісіфікація функції delay
// =================================================================

/**
 * Оригінальна callback функція
 */
function delay(ms, callback) {
  setTimeout(() => {
    callback();
  }, ms);
}

/**
 * Проміс-версія delay
 */
function delayPromise(ms) {
  return new Promise((resolve) => {
    delay(ms, resolve);
  });
}

/**
 * Проміс-версія через util.promisify
 */
const delayPromisified = promisify(delay);

/**
 * API: Виконання затримки
 */
app.post('/api/task3/delay', async (req, res) => {
  try {
    const { ms, method } = req.body;

    if (!ms || ms < 0 || ms > 10000) {
      return res.status(400).json({
        success: false,
        error: 'Затримка має бути від 0 до 10000 мс'
      });
    }

    const startTime = Date.now();

    if (method === 'promisify') {
      await delayPromisified(ms);
    } else {
      await delayPromise(ms);
    }

    const endTime = Date.now();
    const actualDelay = endTime - startTime;

    res.json({
      success: true,
      requestedDelay: ms,
      actualDelay: actualDelay,
      method: method || 'manual',
      message: `Затримка ${ms}мс виконана успішно`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * API: Паралельне виконання кількох затримок
 */
app.post('/api/task3/parallel-delays', async (req, res) => {
  try {
    const { delays } = req.body;

    if (!Array.isArray(delays) || delays.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Передайте масив затримок'
      });
    }

    const startTime = Date.now();

    const results = await Promise.all(
      delays.map(ms => delayPromise(ms).then(() => ({ delay: ms, completed: true })))
    );

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    res.json({
      success: true,
      delays: results,
      totalTime: totalTime,
      expectedTime: Math.max(...delays),
      message: 'Паралельне виконання завершено'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =================================================================
// Завдання 4: Промісіфікація з кількома результатами
// =================================================================

/**
 * Оригінальна функція calculate з callback
 */
function calculate(a, b, callback) {
  setTimeout(() => {
    if (b === 0) {
      callback(new Error('Ділення на нуль неможливе!'));
      return;
    }

    const sum = a + b;
    const product = a * b;
    const quotient = a / b;

    callback(null, sum, product, quotient);
  }, 100);
}

/**
 * Універсальна функція промісіфікації
 */
function promisifyMulti(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  };
}

const calculatePromise = promisifyMulti(calculate);

/**
 * API: Обчислення з кількома результатами
 */
app.post('/api/task4/calculate', async (req, res) => {
  try {
    const { a, b } = req.body;

    if (typeof a !== 'number' || typeof b !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'a та b мають бути числами'
      });
    }

    const [sum, product, quotient] = await calculatePromise(a, b);

    res.json({
      success: true,
      input: { a, b },
      results: {
        sum,
        product,
        quotient: parseFloat(quotient.toFixed(4))
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
      input: req.body
    });
  }
});

/**
 * API: Множинні обчислення з Promise.allSettled
 */
app.post('/api/task4/batch-calculate', async (req, res) => {
  try {
    const { operations } = req.body;

    if (!Array.isArray(operations) || operations.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Передайте масив операцій'
      });
    }

    const promises = operations.map(({ a, b }) => calculatePromise(a, b));
    const results = await Promise.allSettled(promises);

    const processed = results.map((result, index) => {
      const { a, b } = operations[index];

      if (result.status === 'fulfilled') {
        const [sum, product, quotient] = result.value;
        return {
          input: { a, b },
          success: true,
          results: {
            sum,
            product,
            quotient: parseFloat(quotient.toFixed(4))
          }
        };
      } else {
        return {
          input: { a, b },
          success: false,
          error: result.reason.message
        };
      }
    });

    const successCount = processed.filter(p => p.success).length;
    const errorCount = processed.filter(p => !p.success).length;

    res.json({
      success: true,
      operations: processed,
      stats: {
        total: processed.length,
        successful: successCount,
        failed: errorCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// =================================================================
// Запуск сервера
// =================================================================

app.listen(PORT, () => {
  console.log('\n' + '╔'.padEnd(62, '═') + '╗');
  console.log('║  🚀 Сервер запущено!'.padEnd(62) + '║');
  console.log('║'.padEnd(62) + '║');
  console.log(`║  📍 URL: http://localhost:${PORT}`.padEnd(62) + '║');
  console.log('║  📂 Проєкт: Лабораторна робота №9'.padEnd(62) + '║');
  console.log('║  📝 Обробка промісів та промісіфікація'.padEnd(62) + '║');
  console.log('╚'.padEnd(62, '═') + '╝');
  console.log('\nAPI Endpoints:');
  console.log('  GET    /api/task1/fetch-user/:userId       - Завдання 1');
  console.log('  POST   /api/task2/process-text             - Завдання 2');
  console.log('  GET    /api/task2/read-output              - Завдання 2');
  console.log('  POST   /api/task3/delay                    - Завдання 3');
  console.log('  POST   /api/task3/parallel-delays          - Завдання 3');
  console.log('  POST   /api/task4/calculate                - Завдання 4');
  console.log('  POST   /api/task4/batch-calculate          - Завдання 4');
  console.log();
});
