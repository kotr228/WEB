const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Шляхи до файлів
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS1_FILE = path.join(DATA_DIR, 'products1.json');
const PRODUCTS2_FILE = path.join(DATA_DIR, 'products2.json');
const COMBINED_FILE = path.join(DATA_DIR, 'products_combined.json');
const POSTS_FILE = path.join(DATA_DIR, 'user_posts.json');

// =====================
// Завдання 1: Користувачі
// =====================

// GET всіх користувачів
app.get('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST новий користувач
app.post('/api/users', (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Необхідно вказати ім\'я та email'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Некоректний формат email'
      });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);

    // Перевірка на дублікат
    if (users.some(u => u.email === email)) {
      return res.status(400).json({
        success: false,
        error: 'Користувач з таким email вже існує'
      });
    }

    // Генерація ID
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const newUser = {
      id: maxId + 1,
      name,
      email
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.json({ success: true, user: newUser, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE користувача
app.delete('/api/users/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    let users = JSON.parse(data);

    const initialLength = users.length;
    users = users.filter(u => u.id !== id);

    if (users.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: 'Користувача не знайдено'
      });
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    res.json({ success: true, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================
// Завдання 2: Товари
// =====================

// GET товари з файлу
app.get('/api/products/:file', (req, res) => {
  try {
    const file = req.params.file; // products1, products2, або combined
    let filePath;

    if (file === 'products1') filePath = PRODUCTS1_FILE;
    else if (file === 'products2') filePath = PRODUCTS2_FILE;
    else if (file === 'combined') filePath = COMBINED_FILE;
    else return res.status(400).json({ success: false, error: 'Невірний файл' });

    const data = fs.readFileSync(filePath, 'utf8');
    const products = JSON.parse(data);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST злиття товарів
app.post('/api/products/merge', (req, res) => {
  try {
    const data1 = fs.readFileSync(PRODUCTS1_FILE, 'utf8');
    const data2 = fs.readFileSync(PRODUCTS2_FILE, 'utf8');

    const products1 = JSON.parse(data1);
    const products2 = JSON.parse(data2);

    // Об'єднання через Map
    const productMap = new Map();
    products1.forEach(p => productMap.set(p.id, p));
    products2.forEach(p => {
      if (!productMap.has(p.id)) {
        productMap.set(p.id, p);
      }
    });

    // Сортування за ціною
    const merged = Array.from(productMap.values()).sort((a, b) => a.price - b.price);

    // Збереження
    fs.writeFileSync(COMBINED_FILE, JSON.stringify(merged, null, 2));

    // Статистика
    const duplicatesRemoved = (products1.length + products2.length) - merged.length;
    const totalPrice = merged.reduce((sum, p) => sum + p.price, 0);
    const avgPrice = totalPrice / merged.length;

    res.json({
      success: true,
      products: merged,
      stats: {
        total: merged.length,
        duplicatesRemoved,
        totalPrice,
        avgPrice: parseFloat(avgPrice.toFixed(2)),
        minPrice: merged[0].price,
        maxPrice: merged[merged.length - 1].price
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================
// Завдання 3: Пости з API
// =====================

// GET пости з JSONPlaceholder
app.get('/api/posts', async (req, res) => {
  const userId = parseInt(req.query.userId) || 5;

  try {
    const posts = await new Promise((resolve, reject) => {
      https.get('https://jsonplaceholder.typicode.com/posts', (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    const filtered = posts.filter(p => p.userId === userId);

    // Збереження у файл
    fs.writeFileSync(POSTS_FILE, JSON.stringify(filtered, null, 2));

    res.json({
      success: true,
      posts: filtered,
      stats: {
        total: filtered.length,
        userId: userId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET збережені пости
app.get('/api/posts/saved', (req, res) => {
  try {
    const data = fs.readFileSync(POSTS_FILE, 'utf8');
    const posts = JSON.parse(data);
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 Сервер запущено!                                      ║
║                                                            ║
║  📍 URL: http://localhost:${PORT}                            ║
║  📂 Проєкт: Лабораторна робота №8                         ║
║  📝 Робота з JSON-файлами                                 ║
╚════════════════════════════════════════════════════════════╝

API Endpoints:
  GET    /api/users              - Список користувачів
  POST   /api/users              - Додати користувача
  DELETE /api/users/:id          - Видалити користувача

  GET    /api/products/:file     - Товари (products1/products2/combined)
  POST   /api/products/merge     - Об'єднати товари

  GET    /api/posts?userId=5     - Завантажити пости з API
  GET    /api/posts/saved        - Збережені пости
  `);
});
