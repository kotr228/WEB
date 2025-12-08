// =====================
// API базовий URL
// =====================
const API_URL = 'http://localhost:3000/api';

// =====================
// Утилітні функції
// =====================

/**
 * Показати сповіщення
 */
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

/**
 * Перемикання вкладок
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Видаляємо active з усіх кнопок і панелей
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // Додаємо active до поточної кнопки
      button.classList.add('active');

      // Показуємо відповідну панель
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// =====================
// Завдання 1: Користувачі
// =====================

/**
 * Завантаження користувачів
 */
async function loadUsers() {
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();

    if (data.success) {
      renderUsersTable(data.users);
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('Помилка завантаження користувачів', 'error');
    console.error(error);
  }
}

/**
 * Відображення таблиці користувачів
 */
function renderUsersTable(users) {
  const container = document.getElementById('usersTable');

  if (users.length === 0) {
    container.innerHTML = '<p class="empty-message">Немає користувачів</p>';
    return;
  }

  const table = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Ім'я</th>
          <th>Email</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        ${users.map(user => `
          <tr>
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
              <button class="btn btn-danger" onclick="deleteUser(${user.id})">
                🗑️ Видалити
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = table;
}

/**
 * Додавання користувача
 */
async function addUser(event) {
  event.preventDefault();

  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });

    const data = await response.json();

    if (data.success) {
      showNotification(`Користувача "${name}" додано! Всього: ${data.total}`);
      document.getElementById('addUserForm').reset();
      loadUsers();
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('Помилка додавання користувача', 'error');
    console.error(error);
  }
}

/**
 * Видалення користувача
 */
async function deleteUser(id) {
  if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Користувача видалено');
      loadUsers();
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('Помилка видалення користувача', 'error');
    console.error(error);
  }
}

// =====================
// Завдання 2: Товари
// =====================

/**
 * Завантаження товарів
 */
async function loadProducts(file) {
  try {
    const response = await fetch(`${API_URL}/products/${file}`);
    const data = await response.json();

    if (data.success) {
      const title = {
        'products1': 'Товари з products1.json',
        'products2': 'Товари з products2.json',
        'combined': 'Об\'єднані товари (відсортовано за ціною)'
      }[file];

      document.getElementById('productsTitle').textContent = title;
      renderProductsTable(data.products);
      document.getElementById('productsStats').style.display = 'none';
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('Помилка завантаження товарів', 'error');
    console.error(error);
  }
}

/**
 * Відображення таблиці товарів
 */
function renderProductsTable(products) {
  const container = document.getElementById('productsTable');

  if (products.length === 0) {
    container.innerHTML = '<p class="empty-message">Немає товарів</p>';
    return;
  }

  const table = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Назва</th>
          <th>Ціна (грн)</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = table;
}

/**
 * Об'єднання товарів
 */
async function mergeProducts() {
  try {
    const response = await fetch(`${API_URL}/products/merge`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      showNotification('Товари успішно об\'єднано!');
      document.getElementById('productsTitle').textContent = 'Об\'єднані товари (відсортовано за ціною)';
      renderProductsTable(data.products);
      renderProductsStats(data.stats);
    } else {
      showNotification(data.error, 'error');
    }
  } catch (error) {
    showNotification('Помилка об\'єднання товарів', 'error');
    console.error(error);
  }
}

/**
 * Відображення статистики товарів
 */
function renderProductsStats(stats) {
  const container = document.getElementById('statsContent');

  const html = `
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">Всього товарів</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.duplicatesRemoved}</div>
        <div class="stat-label">Видалено дублікатів</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalPrice}</div>
        <div class="stat-label">Загальна вартість (грн)</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.avgPrice}</div>
        <div class="stat-label">Середня ціна (грн)</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.minPrice}</div>
        <div class="stat-label">Мінімальна ціна (грн)</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.maxPrice}</div>
        <div class="stat-label">Максимальна ціна (грн)</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  document.getElementById('productsStats').style.display = 'block';
}

// =====================
// Завдання 3: Пости
// =====================

/**
 * Завантаження постів з API
 */
async function fetchPosts(event) {
  event.preventDefault();

  const userId = document.getElementById('userId').value;

  try {
    document.getElementById('postsList').innerHTML = '<div class="loading">Завантаження</div>';

    const response = await fetch(`${API_URL}/posts?userId=${userId}`);
    const data = await response.json();

    if (data.success) {
      showNotification(`Завантажено ${data.stats.total} постів для користувача #${userId}`);
      document.getElementById('postsTitle').textContent = `Пости користувача #${userId} (з API)`;
      renderPosts(data.posts);
      renderPostsStats(data.stats);
    } else {
      showNotification(data.error, 'error');
      document.getElementById('postsList').innerHTML = '';
    }
  } catch (error) {
    showNotification('Помилка завантаження постів', 'error');
    document.getElementById('postsList').innerHTML = '';
    console.error(error);
  }
}

/**
 * Завантаження збережених постів
 */
async function loadSavedPosts() {
  try {
    document.getElementById('postsList').innerHTML = '<div class="loading">Завантаження</div>';

    const response = await fetch(`${API_URL}/posts/saved`);
    const data = await response.json();

    if (data.success) {
      showNotification('Збережені пости завантажено');
      document.getElementById('postsTitle').textContent = 'Збережені пости';
      renderPosts(data.posts);

      if (data.posts.length > 0) {
        renderPostsStats({ total: data.posts.length });
      } else {
        document.getElementById('postsStats').style.display = 'none';
      }
    } else {
      showNotification(data.error, 'error');
      document.getElementById('postsList').innerHTML = '';
    }
  } catch (error) {
    showNotification('Помилка завантаження збережених постів', 'error');
    document.getElementById('postsList').innerHTML = '';
    console.error(error);
  }
}

/**
 * Відображення постів
 */
function renderPosts(posts) {
  const container = document.getElementById('postsList');

  if (posts.length === 0) {
    container.innerHTML = '<p class="empty-message">Немає постів</p>';
    return;
  }

  const html = posts.map(post => `
    <div class="post">
      <div class="post-title">${post.title}</div>
      <div class="post-meta">Post ID: ${post.id} | User ID: ${post.userId}</div>
      <div class="post-body">${post.body}</div>
    </div>
  `).join('');

  container.innerHTML = html;
}

/**
 * Відображення статистики постів
 */
function renderPostsStats(stats) {
  const container = document.getElementById('postsStatsContent');

  const html = `
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">Всього постів</div>
      </div>
      ${stats.userId ? `
        <div class="stat-item">
          <div class="stat-value">${stats.userId}</div>
          <div class="stat-label">User ID</div>
        </div>
      ` : ''}
    </div>
  `;

  container.innerHTML = html;
  document.getElementById('postsStats').style.display = 'block';
}

// =====================
// Ініціалізація
// =====================

document.addEventListener('DOMContentLoaded', () => {
  // Ініціалізація вкладок
  initTabs();

  // Завантаження даних для першої вкладки
  loadUsers();

  // Прив'язка форм
  document.getElementById('addUserForm').addEventListener('submit', addUser);
  document.getElementById('fetchPostsForm').addEventListener('submit', fetchPosts);

  console.log('✅ Додаток ініціалізовано');
});
