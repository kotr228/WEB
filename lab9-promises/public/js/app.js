// =====================
// API базовий URL
// =====================
const API_URL = 'http://localhost:3001/api';

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
  }, 4000);
}

/**
 * Перемикання вкладок
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

/**
 * Показати завантаження
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loading">Завантаження</div>';
}

// =====================
// Завдання 1: Promise.all для завантаження даних
// =====================

async function fetchUserData() {
  const userId = document.getElementById('userId').value;
  const resultContainer = document.getElementById('task1Result');

  if (!userId || userId < 1 || userId > 10) {
    showNotification('User ID має бути від 1 до 10', 'error');
    return;
  }

  showLoading('task1Result');

  try {
    const response = await fetch(`${API_URL}/task1/fetch-user/${userId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification(`Дані користувача #${userId} завантажено!`, 'success');

    const { user, posts, stats } = data;

    resultContainer.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✅ Дані успішно завантажено (Promise.all)</div>
        <div class="user-card">
          <div class="user-info">
            <h3>👤 Користувач</h3>
            <div class="result-item"><strong>Ім'я:</strong> ${user.name}</div>
            <div class="result-item"><strong>Email:</strong> ${user.email}</div>
            <div class="result-item"><strong>Телефон:</strong> ${user.phone}</div>
            <div class="result-item"><strong>Компанія:</strong> ${user.company.name}</div>
            <div class="result-item"><strong>Сайт:</strong> ${user.website}</div>
          </div>
          <div class="posts-info">
            <h3>📝 Пости (${stats.postsCount})</h3>
            <div style="max-height: 300px; overflow-y: auto;">
              ${posts.slice(0, 5).map(post => `
                <div class="post-item">
                  <div class="post-title">${post.title}</div>
                  <div class="post-body">${post.body.substring(0, 100)}...</div>
                </div>
              `).join('')}
              ${posts.length > 5 ? `<p style="text-align: center; color: #6b7280;">... та ще ${posts.length - 5} постів</p>` : ''}
            </div>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${stats.postsCount}</div>
            <div class="stat-label">Всього постів</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${userId}</div>
            <div class="stat-label">User ID</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ Помилка завантаження</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// =====================
// Завдання 2: Ланцюжок промісів
// =====================

async function processText() {
  const text = document.getElementById('textInput').value;
  const resultContainer = document.getElementById('task2Result');

  if (!text.trim()) {
    showNotification('Введіть текст для обробки', 'warning');
    return;
  }

  showLoading('task2Result');

  try {
    const response = await fetch(`${API_URL}/task2/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification('Текст успішно оброблено!', 'success');

    resultContainer.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✅ ${data.message}</div>
        <p><strong>Ланцюжок промісів:</strong> writeFile → readFile → toUpperCase → writeFile</p>

        <h3>📄 Оригінальний текст:</h3>
        <div class="text-display">${data.original}</div>

        <h3>📄 Перетворений текст (UPPER CASE):</h3>
        <div class="text-display">${data.transformed}</div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${data.original.length}</div>
            <div class="stat-label">Оригінал (символів)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.transformed.length}</div>
            <div class="stat-label">Результат (символів)</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ Помилка обробки</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

async function readOutput() {
  const resultContainer = document.getElementById('task2Result');

  showLoading('task2Result');

  try {
    const response = await fetch(`${API_URL}/task2/read-output`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification('Файл output.txt прочитано!', 'success');

    resultContainer.innerHTML = `
      <div class="result-box success">
        <div class="result-title">📄 Вміст файлу output.txt</div>
        <div class="text-display">${data.content}</div>
      </div>
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ ${error.message}</div>
      </div>
    `;
  }
}

// =====================
// Завдання 3: Промісіфікація delay
// =====================

async function executeDelay() {
  const ms = parseInt(document.getElementById('delayMs').value);
  const method = document.getElementById('delayMethod').value;
  const resultContainer = document.getElementById('task3Result');

  if (!ms || ms < 0 || ms > 10000) {
    showNotification('Затримка має бути від 0 до 10000 мс', 'warning');
    return;
  }

  resultContainer.innerHTML = `<div class="loading">Виконання затримки ${ms}мс...</div>`;

  try {
    const response = await fetch(`${API_URL}/task3/delay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ms, method })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification(`Затримка ${ms}мс виконана!`, 'success');

    const methodName = method === 'promisify' ? 'util.promisify()' : 'Ручна промісіфікація';

    resultContainer.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✅ Затримка виконана</div>
        <div class="result-item"><strong>Метод:</strong> ${methodName}</div>
        <div class="result-item"><strong>Запитана затримка:</strong> ${data.requestedDelay} мс</div>
        <div class="result-item"><strong>Фактична затримка:</strong> ${data.actualDelay} мс</div>
        <div class="result-item"><strong>Точність:</strong> ${((data.actualDelay / data.requestedDelay) * 100).toFixed(1)}%</div>
      </div>
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ Помилка виконання</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

async function executeParallelDelays() {
  const delaysInput = document.getElementById('parallelDelays').value;
  const resultContainer = document.getElementById('task3Result');

  const delays = delaysInput.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));

  if (delays.length === 0) {
    showNotification('Введіть коректні затримки', 'warning');
    return;
  }

  resultContainer.innerHTML = `<div class="loading">Паралельне виконання ${delays.length} затримок...</div>`;

  try {
    const response = await fetch(`${API_URL}/task3/parallel-delays`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delays })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification('Паралельне виконання завершено!', 'success');

    resultContainer.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✅ Promise.all - Паралельне виконання</div>
        <p><strong>Затримки:</strong> ${delays.join(', ')} мс</p>
        <div class="result-item"><strong>Загальний час:</strong> ${data.totalTime} мс</div>
        <div class="result-item"><strong>Очікуваний час:</strong> ${data.expectedTime} мс (найдовша затримка)</div>
        <div class="result-item">
          <strong>Ефективність:</strong>
          Паралельне виконання зайняло ≈${data.totalTime}мс замість ${delays.reduce((a, b) => a + b, 0)}мс послідовного
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${delays.length}</div>
            <div class="stat-label">Затримок</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.totalTime}</div>
            <div class="stat-label">Загальний час (мс)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Math.max(...delays)}</div>
            <div class="stat-label">Найдовша (мс)</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ Помилка виконання</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// =====================
// Завдання 4: Промісіфікація з кількома результатами
// =====================

async function calculateSingle() {
  const a = parseFloat(document.getElementById('calcA').value);
  const b = parseFloat(document.getElementById('calcB').value);
  const resultContainer = document.getElementById('task4Result');

  if (isNaN(a) || isNaN(b)) {
    showNotification('Введіть коректні числа', 'warning');
    return;
  }

  showLoading('task4Result');

  try {
    const response = await fetch(`${API_URL}/task4/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ a, b })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification('Обчислення виконано!', 'success');

    const { results } = data;

    resultContainer.innerHTML = `
      <div class="result-box success">
        <div class="result-title">✅ Результати обчислень (promisifyMulti)</div>
        <p><strong>Вхідні дані:</strong> a = ${a}, b = ${b}</p>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${results.sum}</div>
            <div class="stat-label">Сума (a + b)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${results.product}</div>
            <div class="stat-label">Добуток (a × b)</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${results.quotient}</div>
            <div class="stat-label">Частка (a ÷ b)</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ ${error.message}</div>
        <p>Перевірте введені дані</p>
      </div>
    `;
  }
}

async function calculateBatch() {
  const batchInputs = document.querySelectorAll('.batch-input');
  const operations = [];

  batchInputs.forEach(input => {
    const a = parseFloat(input.querySelector('.batch-a').value);
    const b = parseFloat(input.querySelector('.batch-b').value);
    if (!isNaN(a) && !isNaN(b)) {
      operations.push({ a, b });
    }
  });

  if (operations.length === 0) {
    showNotification('Введіть коректні дані', 'warning');
    return;
  }

  const resultContainer = document.getElementById('task4Result');
  showLoading('task4Result');

  try {
    const response = await fetch(`${API_URL}/task4/batch-calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operations })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    showNotification(`Виконано ${data.stats.total} обчислень!`, 'success');

    const resultsHtml = data.operations.map((op, index) => {
      if (op.success) {
        return `
          <div class="result-box success">
            <div class="result-title">✅ Обчислення ${index + 1}: ${op.input.a} та ${op.input.b}</div>
            <div class="result-item"><strong>Сума:</strong> ${op.results.sum}</div>
            <div class="result-item"><strong>Добуток:</strong> ${op.results.product}</div>
            <div class="result-item"><strong>Частка:</strong> ${op.results.quotient}</div>
          </div>
        `;
      } else {
        return `
          <div class="result-box error">
            <div class="result-title">❌ Обчислення ${index + 1}: ${op.input.a} та ${op.input.b}</div>
            <p>${op.error}</p>
          </div>
        `;
      }
    }).join('');

    resultContainer.innerHTML = `
      <div class="result-box">
        <div class="result-title">📊 Promise.allSettled - Множинні обчислення</div>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${data.stats.total}</div>
            <div class="stat-label">Всього</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.stats.successful}</div>
            <div class="stat-label">Успішно</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${data.stats.failed}</div>
            <div class="stat-label">Помилок</div>
          </div>
        </div>
      </div>
      ${resultsHtml}
    `;
  } catch (error) {
    showNotification(`Помилка: ${error.message}`, 'error');
    resultContainer.innerHTML = `
      <div class="result-box error">
        <div class="result-title">❌ Помилка обчислень</div>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// =====================
// Ініціалізація
// =====================

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  console.log('✅ Додаток ініціалізовано');
});
