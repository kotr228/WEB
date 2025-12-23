import './style.css'
// Модуль 6: Bootstrap та Axios
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'
import axios from 'axios'

// =========================================
// Custom Error Classes (Модуль 8)
// =========================================

/**
 * Базовий клас для всіх помилок додатку
 */
class AppError extends Error {
  constructor(message, code = 'APP_ERROR') {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.timestamp = new Date()
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp,
      stack: this.stack
    }
  }
}

/**
 * Помилка валідації
 */
class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR')
    this.field = field
  }
}

/**
 * Мережева помилка
 */
class NetworkError extends AppError {
  constructor(message, statusCode = null, url = null) {
    super(message, 'NETWORK_ERROR')
    this.statusCode = statusCode
    this.url = url
  }
}

/**
 * API помилка
 */
class APIError extends AppError {
  constructor(message, endpoint = null, method = 'GET') {
    super(message, 'API_ERROR')
    this.endpoint = endpoint
    this.method = method
  }
}

/**
 * Error Logger - збирає та логує помилки
 */
class ErrorLogger {
  constructor() {
    this.errors = []
    this.maxErrors = 50
  }

  log(error, context = {}) {
    const errorEntry = {
      error: error instanceof Error ? error : new Error(String(error)),
      context,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    this.errors.unshift(errorEntry)

    // Обмежуємо кількість збережених помилок
    if (this.errors.length > this.maxErrors) {
      this.errors.pop()
    }

    // Логуємо в console з деталями
    console.group(`❌ Error: ${errorEntry.error.name}`)
    console.error('Message:', errorEntry.error.message)
    console.error('Code:', errorEntry.error.code)
    console.error('Context:', context)
    console.error('Stack:', errorEntry.error.stack)
    console.error('Timestamp:', errorEntry.timestamp)
    console.groupEnd()

    // Можна відправити на сервер для моніторингу
    // this.sendToServer(errorEntry)

    return errorEntry
  }

  getErrors() {
    return this.errors
  }

  clearErrors() {
    this.errors = []
    console.log('🗑️ Error log cleared')
  }

  getErrorStats() {
    const stats = {}
    this.errors.forEach(entry => {
      const name = entry.error.name
      stats[name] = (stats[name] || 0) + 1
    })
    return stats
  }
}

// Глобальний error logger
const errorLogger = new ErrorLogger()

/**
 * Global Error Handler для uncaught exceptions
 */
window.addEventListener('error', (event) => {
  errorLogger.log(event.error, {
    type: 'uncaught',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  })

  // Показуємо user-friendly повідомлення
  showNotification('Виникла несподівана помилка', 'error')

  // Запобігаємо дефолтному поводженню браузера
  event.preventDefault()
})

/**
 * Global handler для unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  errorLogger.log(event.reason, {
    type: 'unhandled_rejection',
    promise: event.promise
  })

  showNotification('Помилка асинхронної операції', 'error')

  event.preventDefault()
})

/**
 * Wrapper для безпечного виконання функцій з error handling
 */
function safeExecute(fn, errorHandler = null) {
  return async function (...args) {
    try {
      return await fn.apply(this, args)
    } catch (error) {
      errorLogger.log(error, {
        function: fn.name,
        arguments: args
      })

      if (errorHandler) {
        return errorHandler(error)
      } else {
        showNotification(`Помилка: ${error.message}`, 'error')
        throw error
      }
    }
  }
}

/**
 * Показує детальну інформацію про помилку (для розробки)
 */
function showErrorDetails(error) {
  console.group('🔍 Error Details')
  console.log('Name:', error.name)
  console.log('Message:', error.message)
  console.log('Code:', error.code)
  console.log('Stack:', error.stack)

  if (error instanceof NetworkError) {
    console.log('Status Code:', error.statusCode)
    console.log('URL:', error.url)
  }

  if (error instanceof APIError) {
    console.log('Endpoint:', error.endpoint)
    console.log('Method:', error.method)
  }

  if (error instanceof ValidationError) {
    console.log('Field:', error.field)
  }

  console.groupEnd()
}

// Експортуємо для використання
window.errorLogger = errorLogger
window.AppError = AppError
window.ValidationError = ValidationError
window.NetworkError = NetworkError
window.APIError = APIError

// =========================================
// Налаштування Axios (Модуль 6)
// =========================================

// Створення екземпляру Axios з базовою конфігурацією
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor - додає токен автентифікації та логування
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Axios Request: ${config.method.toUpperCase()} ${config.url}`)

    // Симуляція додавання токена (якби була справжня авторизація)
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    const requestError = new APIError(
      `Request setup failed: ${error.message}`,
      error.config?.url,
      error.config?.method
    )
    errorLogger.log(requestError, {
      type: 'axios_request',
      config: error.config
    })
    return Promise.reject(requestError)
  }
)

// Response Interceptor - обробка відповідей та помилок
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Axios Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    let customError
    let errorMessage = ''

    if (error.response) {
      // Сервер відповів з кодом помилки
      switch (error.response.status) {
        case 401:
          errorMessage = '🔒 Unauthorized - потрібна авторизація'
          break
        case 404:
          errorMessage = '🔍 Not Found - ресурс не знайдено'
          break
        case 500:
          errorMessage = '💥 Server Error - помилка сервера'
          break
        default:
          errorMessage = `⚠️ HTTP Error ${error.response.status}`
      }

      customError = new NetworkError(
        errorMessage,
        error.response.status,
        error.config?.url
      )
      customError.responseData = error.response.data

      errorLogger.log(customError, {
        type: 'axios_response',
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      })
    } else if (error.request) {
      // Запит був відправлений, але відповіді не було
      customError = new NetworkError(
        '📡 No response received from server',
        null,
        error.config?.url
      )

      errorLogger.log(customError, {
        type: 'axios_no_response',
        request: error.request
      })
    } else {
      // Щось пішло не так при налаштуванні запиту
      customError = new APIError(
        `⚙️ Request configuration error: ${error.message}`,
        error.config?.url,
        error.config?.method
      )

      errorLogger.log(customError, {
        type: 'axios_config_error',
        originalMessage: error.message
      })
    }

    return Promise.reject(customError)
  }
)

// Експортуємо для використання в додатку
window.bootstrap = bootstrap
window.api = api

// =========================================
// Дані курсів (Mock Data)
// =========================================
const coursesData = [
  {
    id: 1,
    title: 'JavaScript для початківців',
    instructor: 'Олександр Петренко',
    duration: '8 годин',
    description: 'Вивчіть основи JavaScript від змінних до функцій та об\'єктів.',
    icon: '💻',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Змінні та типи даних', duration: '45 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Умовні конструкції', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Цикли та масиви', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 4, title: 'Функції', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 1,
      questions: [
        {
          question: 'Що таке змінна в JavaScript?',
          options: ['Контейнер для зберігання даних', 'Тип даних', 'Функція', 'Оператор'],
          correct: 0
        },
        {
          question: 'Який оператор використовується для порівняння?',
          options: ['=', '==', '===', 'Всі вище'],
          correct: 2
        }
      ]
    }
  },
  {
    id: 2,
    title: 'HTML & CSS Основи',
    instructor: 'Марія Іваненко',
    duration: '6 годин',
    description: 'Створюйте красиві та адаптивні веб-сторінки з HTML та CSS.',
    icon: '🎨',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Структура HTML документа', duration: '40 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'CSS селектори', duration: '45 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Flexbox та Grid', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 2,
      questions: [
        {
          question: 'Що означає CSS?',
          options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
          correct: 1
        }
      ]
    }
  },
  {
    id: 3,
    title: 'React для розробників',
    instructor: 'Дмитро Коваленко',
    duration: '12 годин',
    description: 'Опануйте сучасну бібліотеку для створення інтерактивних інтерфейсів.',
    icon: '⚛️',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Компоненти та Props', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'State та життєвий цикл', duration: '75 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'Hooks', duration: '80 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 3,
      questions: [
        {
          question: 'Що таке компонент в React?',
          options: ['Функція або клас', 'HTML тег', 'CSS клас', 'JavaScript змінна'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 4,
    title: 'Node.js Backend',
    instructor: 'Ігор Сидоренко',
    duration: '10 годин',
    description: 'Створюйте серверні застосунки з Node.js та Express.',
    icon: '🚀',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Вступ до Node.js', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Express фреймворк', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 3, title: 'REST API', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 4,
      questions: [
        {
          question: 'Що таке Node.js?',
          options: ['JavaScript runtime', 'Фреймворк', 'Бібліотека', 'База даних'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 5,
    title: 'Git та GitHub',
    instructor: 'Анна Мельник',
    duration: '4 години',
    description: 'Освойте систему контролю версій та співпрацю в команді.',
    icon: '📦',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Основи Git', duration: '45 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Робота з GitHub', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 5,
      questions: [
        {
          question: 'Що таке commit в Git?',
          options: ['Збереження змін', 'Видалення файлу', 'Створення гілки', 'Об\'єднання гілок'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 6,
    title: 'TypeScript Основи',
    instructor: 'Сергій Ткаченко',
    duration: '7 годин',
    description: 'Додайте типізацію до JavaScript та пишіть більш надійний код.',
    icon: '📘',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Типи даних', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Інтерфейси', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 6,
      questions: [
        {
          question: 'Чим відрізняється TypeScript від JavaScript?',
          options: ['Статичною типізацією', 'Швидкістю', 'Синтаксисом', 'Нічим'],
          correct: 0
        }
      ]
    }
  },
  {
    id: 7,
    title: 'Python для Data Science',
    instructor: 'Олена Шевченко',
    duration: '15 годин',
    description: 'Аналіз даних, машинне навчання та візуалізація з Python.',
    icon: '🐍',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'NumPy та Pandas', duration: '90 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Matplotlib', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 7,
      questions: [
        { question: 'Що таке Pandas?', options: ['Бібліотека для аналізу даних', 'Тварина', 'База даних', 'Фреймворк'], correct: 0 }
      ]
    }
  },
  {
    id: 8,
    title: 'Vue.js Фреймворк',
    instructor: 'Віктор Бойко',
    duration: '11 годин',
    description: 'Прогресивний JavaScript фреймворк для створення UI.',
    icon: '💚',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Vue Instance', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Vuex State Management', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 8,
      questions: [
        { question: 'Що таке Vuex?', options: ['State management', 'Роутер', 'HTTP клієнт', 'UI бібліотека'], correct: 0 }
      ]
    }
  },
  {
    id: 9,
    title: 'MongoDB Основи',
    instructor: 'Тарас Лисенко',
    duration: '8 годин',
    description: 'NoSQL база даних для сучасних застосунків.',
    icon: '🍃',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Колекції та документи', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Aggregation Pipeline', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 9,
      questions: [
        { question: 'MongoDB це...', options: ['NoSQL база даних', 'SQL база даних', 'ORM', 'Фреймворк'], correct: 0 }
      ]
    }
  },
  {
    id: 10,
    title: 'Docker для розробників',
    instructor: 'Максим Павленко',
    duration: '9 годин',
    description: 'Контейнеризація застосунків з Docker.',
    icon: '🐳',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Docker Images', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Docker Compose', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 10,
      questions: [
        { question: 'Що таке Docker?', options: ['Платформа контейнеризації', 'Мова програмування', 'База даних', 'IDE'], correct: 0 }
      ]
    }
  },
  {
    id: 11,
    title: 'GraphQL API',
    instructor: 'Юлія Романенко',
    duration: '7 годин',
    description: 'Сучасний підхід до створення API.',
    icon: '🔷',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Схеми та типи', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Resolvers', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 11,
      questions: [
        { question: 'GraphQL це...', options: ['Query мова для API', 'База даних', 'Фреймворк', 'Бібліотека'], correct: 0 }
      ]
    }
  },
  {
    id: 12,
    title: 'AWS Cloud Computing',
    instructor: 'Андрій Кравченко',
    duration: '13 годин',
    description: 'Хмарні технології Amazon Web Services.',
    icon: '☁️',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'EC2 та S3', duration: '75 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Lambda Functions', duration: '80 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 12,
      questions: [
        { question: 'AWS це...', options: ['Хмарна платформа', 'Мова програмування', 'База даних', 'IDE'], correct: 0 }
      ]
    }
  },
  {
    id: 13,
    title: 'Angular Framework',
    instructor: 'Катерина Білоус',
    duration: '14 годин',
    description: 'Повнофункціональний фреймворк від Google.',
    icon: '🅰️',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Модулі та компоненти', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'RxJS та Observables', duration: '85 хv', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 13,
      questions: [
        { question: 'Angular використовує...', options: ['TypeScript', 'Python', 'Java', 'C++'], correct: 0 }
      ]
    }
  },
  {
    id: 14,
    title: 'Redux State Management',
    instructor: 'Роман Гончар',
    duration: '6 годин',
    description: 'Керування станом у JavaScript застосунках.',
    icon: '🔄',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Store та Actions', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Reducers', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 14,
      questions: [
        { question: 'Redux це...', options: ['State container', 'База даних', 'Фреймворк', 'Сервер'], correct: 0 }
      ]
    }
  },
  {
    id: 15,
    title: 'Next.js Full-Stack',
    instructor: 'Валентина Кузьменко',
    duration: '16 годин',
    description: 'React фреймворк для production застосунків.',
    icon: '▲',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'SSR та SSG', duration: '90 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'API Routes', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 15,
      questions: [
        { question: 'Next.js підтримує...', options: ['SSR та SSG', 'Лише SSR', 'Лише SSG', 'Жодне'], correct: 0 }
      ]
    }
  },
  {
    id: 16,
    title: 'Tailwind CSS',
    instructor: 'Дмитро Савченко',
    duration: '5 годин',
    description: 'Utility-first CSS фреймворк.',
    icon: '🎨',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Utility Classes', duration: '40 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Customization', duration: '50 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 16,
      questions: [
        { question: 'Tailwind це...', options: ['CSS фреймворк', 'JS бібліотека', 'База даних', 'Сервер'], correct: 0 }
      ]
    }
  },
  {
    id: 17,
    title: 'PostgreSQL Database',
    instructor: 'Ігор Мороз',
    duration: '10 годин',
    description: 'Потужна реляційна база даних.',
    icon: '🐘',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'SQL Queries', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Indexing', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 17,
      questions: [
        { question: 'PostgreSQL це...', options: ['SQL база даних', 'NoSQL база даних', 'Фреймворк', 'Мова'], correct: 0 }
      ]
    }
  },
  {
    id: 18,
    title: 'Jest Testing',
    instructor: 'Оксана Ткач',
    duration: '7 годин',
    description: 'Тестування JavaScript застосунків.',
    icon: '🃏',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Unit Tests', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Mocking', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 18,
      questions: [
        { question: 'Jest це...', options: ['Testing framework', 'База даних', 'Сервер', 'Бібліотека UI'], correct: 0 }
      ]
    }
  },
  {
    id: 19,
    title: 'WebSocket Real-time',
    instructor: 'Василь Петров',
    duration: '8 годин',
    description: 'Real-time комунікація в веб-застосунках.',
    icon: '🔌',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'WebSocket API', duration: '60 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Socket.io', duration: '70 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 19,
      questions: [
        { question: 'WebSocket дозволяє...', options: ['Двосторонню комунікацію', 'Лише запити', 'Лише відповіді', 'Жодне'], correct: 0 }
      ]
    }
  },
  {
    id: 20,
    title: 'Svelte Framework',
    instructor: 'Наталія Коваль',
    duration: '9 годин',
    description: 'Компілятор для створення швидких веб-застосунків.',
    icon: '🔥',
    enrolled: false,
    progress: 0,
    lessons: [
      { id: 1, title: 'Reactive Statements', duration: '55 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 2, title: 'Stores', duration: '65 хв', completed: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ],
    test: {
      id: 20,
      questions: [
        { question: 'Svelte це...', options: ['Компілятор', 'Інтерпретатор', 'База даних', 'Сервер'], correct: 0 }
      ]
    }
  }
]

// =========================================
// Стан додатку
// =========================================
let appState = {
  currentPage: 'courses',
  selectedCourseId: null,
  currentTestId: null,
  userAnswers: [],
  nextCourseId: 21, // Для генерації ID нових курсів
  // Модуль 3: Стан фільтрів та сортування
  searchQuery: '',
  filterEnrolled: 'all', // 'all', 'enrolled', 'available'
  sortBy: 'default' // 'default', 'title', 'duration'
}

// =========================================
// DOM Helper Functions (Модуль 2)
// =========================================

/**
 * Створює DOM елемент з класами та атрибутами
 */
function createElement(tag, classes = [], attributes = {}) {
  const element = document.createElement(tag)

  // Додаємо класи через classList
  if (classes.length > 0) {
    element.classList.add(...classes)
  }

  // Додаємо атрибути через setAttribute
  Object.keys(attributes).forEach(key => {
    element.setAttribute(key, attributes[key])
  })

  return element
}

/**
 * Створює текстовий вузол або додає textContent
 */
function setText(element, text) {
  element.textContent = text
  return element
}

/**
 * Додає дочірні елементи до батьківського
 */
function appendChildren(parent, ...children) {
  children.forEach(child => {
    if (child) {
      parent.appendChild(child)
    }
  })
  return parent
}

// =========================================
// Event Handler Utilities (Модуль 3)
// =========================================

/**
 * Debounce - затримка виконання функції до завершення серії викликів
 */
function debounce(func, delay = 300) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Створення та диспетчеризація власних подій
 */
function dispatchCustomEvent(eventName, detail = {}) {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true
  })
  document.dispatchEvent(event)
}

// =========================================
// Валідація форм (Модуль 5)
// =========================================

/**
 * Validation Rules - правила валідації
 */
const ValidationRules = {
  required: (value) => value.trim() !== '',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (value, min) => value.length >= min,
  maxLength: (value, max) => value.length <= max,
  pattern: (value, regex) => regex.test(value),
  url: (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  number: (value) => !isNaN(parseFloat(value)) && isFinite(value),
  min: (value, min) => parseFloat(value) >= min,
  max: (value, max) => parseFloat(value) <= max,
  range: (value, min, max) => parseFloat(value) >= min && parseFloat(value) <= max
}

/**
 * Показує помилку валідації для поля
 */
function showFieldError(field, message) {
  // Видаляємо попередню помилку, якщо є
  clearFieldError(field)

  // Додаємо клас помилки до поля
  field.classList.add('field-error')
  field.setAttribute('aria-invalid', 'true')

  // Створюємо елемент помилки
  const errorDiv = createElement('div', ['error-message'])
  errorDiv.id = `${field.id}-error`
  errorDiv.setAttribute('role', 'alert')
  setText(errorDiv, `⚠️ ${message}`)

  // Додаємо помилку після поля
  field.parentElement.appendChild(errorDiv)

  // Accessibility: зв'язуємо поле з повідомленням про помилку
  field.setAttribute('aria-describedby', errorDiv.id)
}

/**
 * Очищає помилку валідації для поля
 */
function clearFieldError(field) {
  field.classList.remove('field-error')
  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')

  const errorDiv = field.parentElement.querySelector('.error-message')
  if (errorDiv) {
    errorDiv.remove()
  }
}

/**
 * Валідує поле на основі його атрибутів та користувацьких правил
 */
function validateField(field, customRules = {}) {
  const value = field.value
  const fieldName = field.getAttribute('data-label') || field.placeholder || 'Поле'

  // HTML5 валідація через Constraint Validation API (Модуль 8: логування ValidationError)
  if (!field.checkValidity()) {
    const validity = field.validity
    let errorMessage = ''

    if (validity.valueMissing) {
      errorMessage = `${fieldName} є обов'язковим`
    } else if (validity.typeMismatch) {
      if (field.type === 'email') {
        errorMessage = 'Введіть коректну email адресу'
      } else if (field.type === 'url') {
        errorMessage = 'Введіть коректний URL'
      } else {
        errorMessage = `Невірний формат для ${fieldName}`
      }
    } else if (validity.tooShort) {
      errorMessage = `Мінімальна довжина: ${field.minLength} символів`
    } else if (validity.tooLong) {
      errorMessage = `Максимальна довжина: ${field.maxLength} символів`
    } else if (validity.rangeUnderflow) {
      errorMessage = `Мінімальне значення: ${field.min}`
    } else if (validity.rangeOverflow) {
      errorMessage = `Максимальне значення: ${field.max}`
    } else if (validity.patternMismatch) {
      errorMessage = field.getAttribute('data-pattern-message') || 'Невірний формат'
    } else if (validity.stepMismatch) {
      errorMessage = `Значення має бути кратним ${field.step}`
    }

    showFieldError(field, errorMessage)

    // Логуємо ValidationError для відстеження (Модуль 8)
    const validationError = new ValidationError(errorMessage, field.id || field.name)
    errorLogger.log(validationError, {
      fieldType: field.type,
      fieldValue: value,
      validityState: {
        valueMissing: validity.valueMissing,
        typeMismatch: validity.typeMismatch,
        tooShort: validity.tooShort,
        tooLong: validity.tooLong,
        rangeUnderflow: validity.rangeUnderflow,
        rangeOverflow: validity.rangeOverflow,
        patternMismatch: validity.patternMismatch,
        stepMismatch: validity.stepMismatch
      }
    })

    return false
  }

  // Користувацька валідація (Модуль 8: логування ValidationError)
  for (const [ruleName, ruleConfig] of Object.entries(customRules)) {
    const rule = ValidationRules[ruleName]
    if (!rule) continue

    const isValid = typeof ruleConfig === 'function'
      ? ruleConfig(value, field)
      : Array.isArray(ruleConfig)
        ? rule(value, ...ruleConfig)
        : rule(value, ruleConfig)

    if (!isValid) {
      const message = customRules[`${ruleName}Message`] || `Помилка валідації: ${ruleName}`
      showFieldError(field, message)

      // Логуємо ValidationError для користувацьких правил (Модуль 8)
      const validationError = new ValidationError(message, field.id || field.name)
      errorLogger.log(validationError, {
        fieldType: field.type,
        fieldValue: value,
        customRule: ruleName,
        ruleConfig
      })

      return false
    }
  }

  // Якщо все ОК, очищаємо помилки
  clearFieldError(field)
  field.classList.add('field-valid')

  return true
}

/**
 * Валідує всю форму
 */
function validateForm(form, fieldRules = {}) {
  let isValid = true

  // Отримуємо всі поля форми
  const fields = form.querySelectorAll('input, textarea, select')

  fields.forEach(field => {
    // Пропускаємо disabled поля
    if (field.disabled) return

    // Валідуємо поле
    const fieldId = field.id || field.name
    const customRules = fieldRules[fieldId] || {}

    if (!validateField(field, customRules)) {
      isValid = false
    }
  })

  return isValid
}

/**
 * Додає real-time валідацію до поля
 */
function addFieldValidation(field, customRules = {}, validateOnInput = true) {
  // Валідація при втраті фокусу
  field.addEventListener('blur', () => {
    validateField(field, customRules)
  })

  // Валідація під час введення (опціонально)
  if (validateOnInput) {
    field.addEventListener('input', debounce(() => {
      // Очищаємо помилки під час введення
      if (field.classList.contains('field-error')) {
        validateField(field, customRules)
      }
    }, 300))
  }

  // Очищаємо візуальні індикатори при фокусі
  field.addEventListener('focus', () => {
    field.classList.remove('field-valid')
  })
}

// =========================================
// Axios API Functions (Модуль 6)
// =========================================

/**
 * Завантажує курси з API (JSONPlaceholder)
 * Демонструє: GET запит, async/await, обробку помилок
 */
async function loadCoursesFromAPI() {
  try {
    // Показуємо loading стан
    showNotification('⏳ Завантаження курсів з API...', 'info')

    // GET запит до API
    const response = await api.get('/posts', {
      params: {
        _limit: 3 // Отримуємо тільки 3 пости для демонстрації
      }
    })

    // Трансформуємо дані з API в формат наших курсів
    const apiCourses = response.data.map((post, index) => ({
      id: appState.nextCourseId++,
      title: post.title.slice(0, 50), // Обрізаємо довгі назви
      instructor: `API Instructor #${post.userId}`,
      duration: `${Math.floor(Math.random() * 10) + 5} годин`,
      description: post.body,
      icon: ['🌐', '📡', '☁️'][index % 3],
      enrolled: false,
      progress: 0,
      isFromAPI: true, // Позначаємо що курс з API
      lessons: [
        {
          id: 1,
          title: 'Вступний урок',
          duration: '30 хв',
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ],
      test: {
        id: appState.nextCourseId,
        questions: [
          {
            question: 'Чи сподобався вам курс?',
            options: ['Так', 'Дуже так', 'Неймовірно!', 'Супер!'],
            correct: 0
          }
        ]
      }
    }))

    // Додаємо курси до масиву
    coursesData.push(...apiCourses)

    // Оновлюємо список
    renderCourses()

    showNotification(`✅ Завантажено ${apiCourses.length} курсів з API!`, 'success')

    console.log('📊 Модуль 6: Курси завантажені з API', apiCourses)

    return apiCourses
  } catch (error) {
    // Детальна обробка помилок залежно від типу
    if (error instanceof NetworkError) {
      if (error.statusCode === 404) {
        showNotification('❌ API endpoint не знайдено', 'error')
      } else if (error.statusCode === 500) {
        showNotification('❌ Помилка сервера. Спробуйте пізніше', 'error')
      } else if (!error.statusCode) {
        showNotification('❌ Немає зв\'язку з сервером', 'error')
      } else {
        showNotification(`❌ Помилка завантаження: ${error.message}`, 'error')
      }
    } else if (error instanceof APIError) {
      showNotification('❌ Помилка налаштування запиту', 'error')
    } else {
      showNotification('❌ Невідома помилка завантаження курсів', 'error')
      errorLogger.log(error, { function: 'loadCoursesFromAPI' })
    }
    throw error
  }
}

/**
 * Відправляє дані курсу на API
 * Демонструє: POST запит, data payload
 */
async function sendCourseToAPI(courseData) {
  try {
    showNotification('📤 Відправка курсу на сервер...', 'info')

    // POST запит з даними
    const response = await api.post('/posts', {
      title: courseData.title,
      body: courseData.description,
      userId: 1
    })

    console.log('✅ Модуль 6: Курс відправлено на API', response.data)
    showNotification('✅ Курс успішно відправлено на сервер!', 'success')

    return response.data
  } catch (error) {
    // Детальна обробка помилок
    if (error instanceof NetworkError) {
      if (error.statusCode === 401) {
        showNotification('❌ Необхідна авторизація', 'error')
      } else if (error.statusCode === 403) {
        showNotification('❌ Доступ заборонено', 'error')
      } else if (error.statusCode >= 500) {
        showNotification('❌ Помилка сервера при збереженні', 'error')
      } else {
        showNotification('❌ Помилка відправки на сервер', 'error')
      }
    } else if (error instanceof APIError) {
      showNotification('❌ Невірні дані для відправки', 'error')
    } else {
      showNotification('❌ Невідома помилка відправки', 'error')
      errorLogger.log(error, { function: 'sendCourseToAPI', courseData })
    }
    throw error
  }
}

/**
 * Оновлює курс на API
 * Демонструє: PUT запит
 */
async function updateCourseOnAPI(courseId, updates) {
  try {
    const response = await api.put(`/posts/${courseId}`, updates)
    console.log('✅ Модуль 6: Курс оновлено', response.data)
    return response.data
  } catch (error) {
    if (error instanceof NetworkError) {
      showNotification(`❌ Помилка оновлення: ${error.message}`, 'error')
    } else {
      errorLogger.log(error, { function: 'updateCourseOnAPI', courseId, updates })
    }
    throw error
  }
}

/**
 * Видаляє курс з API
 * Демонструє: DELETE запит
 */
async function deleteCourseFromAPI(courseId) {
  try {
    const response = await api.delete(`/posts/${courseId}`)
    console.log('✅ Модуль 6: Курс видалено з API', response.status)
    return response.data
  } catch (error) {
    if (error instanceof NetworkError) {
      if (error.statusCode === 404) {
        showNotification('❌ Курс не знайдено для видалення', 'error')
      } else {
        showNotification(`❌ Помилка видалення курсу`, 'error')
      }
    } else {
      errorLogger.log(error, { function: 'deleteCourseFromAPI', courseId })
    }
    throw error
  }
}

/**
 * Демонстрація паралельних запитів
 * Демонструє: Promise.all, axios.all
 */
async function loadMultipleResources() {
  try {
    showNotification('⏳ Завантаження декількох ресурсів...', 'info')

    // Паралельні запити
    const [users, posts, comments] = await Promise.all([
      api.get('/users?_limit=3'),
      api.get('/posts?_limit=3'),
      api.get('/comments?_limit=5')
    ])

    console.log('📊 Модуль 6: Паралельні запити виконано')
    console.log('👥 Users:', users.data)
    console.log('📝 Posts:', posts.data)
    console.log('💬 Comments:', comments.data)

    showNotification(`✅ Завантажено: ${users.data.length} користувачів, ${posts.data.length} постів, ${comments.data.length} коментарів`, 'success')

    return { users: users.data, posts: posts.data, comments: comments.data }
  } catch (error) {
    if (error instanceof NetworkError) {
      showNotification('❌ Помилка завантаження ресурсів', 'error')
      console.error('Network Error:', error.message, 'Status:', error.statusCode)
    } else {
      showNotification('❌ Невідома помилка паралельних запитів', 'error')
      errorLogger.log(error, { function: 'loadMultipleResources' })
    }
    throw error
  }
}

/**
 * Демонстрація обробки помилок (Модуль 8)
 */
async function testErrorHandling() {
  try {
    // Запит до неіснуючого endpoint
    await api.get('/nonexistent-endpoint-404')
  } catch (error) {
    console.log('✅ Модуль 8: Помилка успішно оброблена')
    console.log('Тип помилки:', error.constructor.name)
    console.log('Код помилки:', error.code)

    if (error instanceof NetworkError) {
      console.log('HTTP Status:', error.statusCode)
      console.log('URL:', error.url)
    }

    // Демонструємо що помилка була залогована
    console.log('Всього помилок у логі:', errorLogger.getErrors().length)
  }
}

// =========================================
// Advanced API Interactions (Модуль 7)
// =========================================

// Simple cache для API responses
const apiCache = new Map()
let abortController = null

/**
 * Завантажує дані з кешуванням
 * Демонструє: Cache strategy, AbortController
 */
async function loadWithCache(url, cacheTime = 60000) {
  const cached = apiCache.get(url)
  const now = Date.now()

  // Перевіряємо кеш
  if (cached && (now - cached.timestamp) < cacheTime) {
    console.log('📦 Модуль 7: Дані з кешу', url)
    return cached.data
  }

  // Скасовуємо попередній запит, якщо є
  if (abortController) {
    abortController.abort()
  }

  // Створюємо новий AbortController
  abortController = new AbortController()

  try {
    const response = await api.get(url, {
      signal: abortController.signal
    })

    // Зберігаємо в кеш
    apiCache.set(url, {
      data: response.data,
      timestamp: now
    })

    console.log('🌐 Модуль 7: Дані з API (закешовано)', url)
    return response.data
  } catch (error) {
    if (error.name === 'CanceledError') {
      console.log('⏸️ Запит скасовано')
    }
    throw error
  }
}

/**
 * Pagination: Завантажує користувачів зі сторінкою
 * Демонструє: Query parameters, pagination
 */
async function loadUsersWithPagination(page = 1, limit = 5) {
  try {
    showNotification(`⏳ Завантаження сторінки ${page}...`, 'info')

    const response = await api.get('/users', {
      params: {
        _page: page,
        _limit: limit
      }
    })

    console.log(`📄 Модуль 7: Сторінка ${page}, користувачів: ${response.data.length}`)

    return {
      data: response.data,
      page,
      limit,
      total: parseInt(response.headers['x-total-count'] || '10')
    }
  } catch (error) {
    console.error('❌ Помилка пагінації:', error)
    throw error
  }
}

/**
 * Оптимістичне оновлення: Оновлює UI одразу, потім синхронізує з API
 * Демонструє: Optimistic updates, rollback on error
 */
async function optimisticUpdate(courseId, updates) {
  const course = coursesData.find(c => c.id === courseId)
  if (!course) return

  // Зберігаємо оригінальний стан
  const originalState = { ...course }

  try {
    // Оптимістичне оновлення UI (до запиту до API)
    Object.assign(course, updates)
    renderCourses()

    showNotification('🔄 Синхронізація з сервером...', 'info')

    // Відправляємо на сервер
    await updateCourseOnAPI(courseId, updates)

    showNotification('✅ Оновлено!', 'success')
    console.log('✅ Модуль 7: Оптимістичне оновлення успішне')
  } catch (error) {
    // Rollback при помилці
    Object.assign(course, originalState)
    renderCourses()

    showNotification('❌ Помилка оновлення, відкат змін', 'error')
    console.error('❌ Модуль 7: Rollback оптимістичного оновлення')
  }
}

/**
 * Batch requests: Виконує кілька запитів одночасно з обробкою помилок
 * Демонструє: Promise.allSettled, partial success handling
 */
async function batchLoadData(endpoints) {
  try {
    showNotification('⏳ Завантаження декількох ресурсів...', 'info')

    // Promise.allSettled - чекає всі проміси, навіть якщо деякі відхиляються
    const results = await Promise.allSettled(
      endpoints.map(endpoint => api.get(endpoint))
    )

    // Аналізуємо результати
    const successful = results.filter(r => r.status === 'fulfilled').map(r => r.value.data)
    const failed = results.filter(r => r.status === 'rejected')

    console.log(`✅ Модуль 7: Успішно: ${successful.length}, Помилок: ${failed.length}`)

    if (failed.length > 0) {
      showNotification(`⚠️ ${successful.length} успішно, ${failed.length} помилок`, 'info')
    } else {
      showNotification(`✅ Завантажено всі ${successful.length} ресурсів`, 'success')
    }

    return { successful, failed }
  } catch (error) {
    console.error('❌ Помилка batch запитів:', error)
    throw error
  }
}

/**
 * Retry механізм з exponential backoff
 * Демонструє: Retry logic, exponential backoff
 */
async function fetchWithRetry(url, maxRetries = 3) {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Модуль 7: Спроба ${attempt}/${maxRetries}`)

      const response = await api.get(url)
      console.log(`✅ Успіх на спробі ${attempt}`)
      return response.data
    } catch (error) {
      lastError = error
      console.log(`❌ Помилка на спробі ${attempt}`)

      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000
        console.log(`⏳ Чекаємо ${delay}ms перед наступною спробою...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Показує loading skeleton під час завантаження
 */
function showLoadingSkeleton(container) {
  container.innerHTML = ''

  for (let i = 0; i < 3; i++) {
    const skeleton = createElement('div', ['card', 'mb-3'])
    skeleton.innerHTML = `
      <div class="card-body">
        <div class="placeholder-glow">
          <span class="placeholder col-6"></span>
          <span class="placeholder col-4"></span>
          <span class="placeholder col-8"></span>
        </div>
      </div>
    `
    container.appendChild(skeleton)
  }
}

/**
 * Очищає кеш
 */
function clearAPICache() {
  apiCache.clear()
  console.log('🗑️ Модуль 7: Кеш очищено')
  showNotification('Кеш API очищено', 'info')
}

// =========================================
// Pagination and Infinite Scroll (Модуль 9)
// =========================================

/**
 * Стан пагінації
 */
const paginationState = {
  mode: 'pagination', // 'pagination' | 'infinite' | 'loadmore'
  currentPage: 1,
  itemsPerPage: 6,
  totalPages: 1,
  isLoading: false,
  hasMore: true,
  observer: null
}

/**
 * Обчислює загальну кількість сторінок
 */
function calculateTotalPages(filteredCourses) {
  return Math.ceil(filteredCourses.length / paginationState.itemsPerPage) || 1
}

/**
 * Отримує курси для поточної сторінки
 */
function getCoursesForPage(filteredCourses, page) {
  const startIndex = (page - 1) * paginationState.itemsPerPage
  const endIndex = startIndex + paginationState.itemsPerPage
  return filteredCourses.slice(startIndex, endIndex)
}

/**
 * Створює пагінацію (класична з номерами сторінок)
 */
function createPagination(filteredCourses) {
  const totalPages = calculateTotalPages(filteredCourses)
  paginationState.totalPages = totalPages

  const paginationContainer = createElement('div', ['pagination-container'])
  paginationContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;'

  // Previous button
  const prevBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-primary'])
  setText(prevBtn, '« Попередня')
  prevBtn.disabled = paginationState.currentPage === 1
  prevBtn.addEventListener('click', () => {
    if (paginationState.currentPage > 1) {
      paginationState.currentPage--
      renderCourses()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  // Page numbers
  const pageNumbers = createElement('div', [])
  pageNumbers.style.cssText = 'display: flex; gap: 0.25rem;'

  // Логіка показу номерів сторінок (max 7 кнопок)
  let pagesToShow = []

  if (totalPages <= 7) {
    // Показуємо всі сторінки
    pagesToShow = Array.from({ length: totalPages }, (_, i) => i + 1)
  } else {
    // Показуємо з елліпсисом
    if (paginationState.currentPage <= 3) {
      pagesToShow = [1, 2, 3, 4, 5, '...', totalPages]
    } else if (paginationState.currentPage >= totalPages - 2) {
      pagesToShow = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    } else {
      pagesToShow = [1, '...', paginationState.currentPage - 1, paginationState.currentPage, paginationState.currentPage + 1, '...', totalPages]
    }
  }

  pagesToShow.forEach(page => {
    if (page === '...') {
      const ellipsis = createElement('span', ['px-2'])
      setText(ellipsis, '...')
      ellipsis.style.cssText = 'display: flex; align-items: center; color: #6c757d;'
      pageNumbers.appendChild(ellipsis)
    } else {
      const pageBtn = createElement('button', ['btn', 'btn-sm'])
      if (page === paginationState.currentPage) {
        pageBtn.classList.add('btn-primary')
      } else {
        pageBtn.classList.add('btn-outline-primary')
      }
      setText(pageBtn, String(page))
      pageBtn.style.minWidth = '2.5rem'

      pageBtn.addEventListener('click', () => {
        paginationState.currentPage = page
        renderCourses()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })

      pageNumbers.appendChild(pageBtn)
    }
  })

  // Next button
  const nextBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-primary'])
  setText(nextBtn, 'Наступна »')
  nextBtn.disabled = paginationState.currentPage === totalPages
  nextBtn.addEventListener('click', () => {
    if (paginationState.currentPage < totalPages) {
      paginationState.currentPage++
      renderCourses()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })

  // Page info
  const pageInfo = createElement('div', ['text-muted', 'small', 'w-100', 'text-center'])
  pageInfo.style.marginTop = '0.5rem'
  setText(pageInfo, `Сторінка ${paginationState.currentPage} з ${totalPages} (всього курсів: ${filteredCourses.length})`)

  appendChildren(paginationContainer, prevBtn, pageNumbers, nextBtn)
  paginationContainer.appendChild(pageInfo)

  return paginationContainer
}

/**
 * Створює кнопку "Load More"
 */
function createLoadMoreButton(filteredCourses) {
  const loadedCount = paginationState.currentPage * paginationState.itemsPerPage
  const hasMore = loadedCount < filteredCourses.length

  if (!hasMore) {
    const endMessage = createElement('div', ['text-center', 'text-muted', 'my-4'])
    setText(endMessage, '✓ Всі курси завантажено')
    return endMessage
  }

  const container = createElement('div', ['text-center', 'my-4'])

  const loadMoreBtn = createElement('button', ['btn', 'btn-primary', 'btn-lg'])
  setText(loadMoreBtn, `Завантажити ще (${Math.min(paginationState.itemsPerPage, filteredCourses.length - loadedCount)} курсів)`)

  loadMoreBtn.addEventListener('click', async () => {
    loadMoreBtn.disabled = true
    setText(loadMoreBtn, 'Завантаження...')

    // Симулюємо затримку завантаження
    await new Promise(resolve => setTimeout(resolve, 500))

    paginationState.currentPage++

    // Рендеримо додаткові курси без очищення попередніх
    const coursesList = document.getElementById('courses-list')
    const coursesToAdd = getCoursesForPage(filteredCourses, paginationState.currentPage)

    coursesToAdd.forEach(course => {
      const card = createCourseCard(course)
      coursesList.appendChild(card)
    })

    // Видаляємо стару кнопку і додаємо нову
    const oldLoadMore = document.getElementById('load-more-container')
    if (oldLoadMore) {
      oldLoadMore.remove()
    }

    const newLoadMore = createLoadMoreButton(filteredCourses)
    newLoadMore.id = 'load-more-container'
    coursesList.parentElement.appendChild(newLoadMore)
  })

  container.appendChild(loadMoreBtn)
  return container
}

/**
 * Створює infinite scroll observer
 */
function setupInfiniteScroll(filteredCourses) {
  // Видаляємо попередній observer
  if (paginationState.observer) {
    paginationState.observer.disconnect()
  }

  // Створюємо sentinel елемент
  const sentinel = createElement('div', ['infinite-scroll-sentinel'])
  sentinel.id = 'scroll-sentinel'
  sentinel.style.cssText = 'height: 20px; margin: 2rem 0;'

  const loadedCount = paginationState.currentPage * paginationState.itemsPerPage
  const hasMore = loadedCount < filteredCourses.length

  if (!hasMore) {
    const endMessage = createElement('div', ['text-center', 'text-muted', 'my-4'])
    setText(endMessage, '✓ Всі курси завантажено')
    return endMessage
  }

  // Створюємо Intersection Observer
  paginationState.observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries

      if (entry.isIntersecting && !paginationState.isLoading) {
        paginationState.isLoading = true

        // Показуємо loading skeleton
        const coursesList = document.getElementById('courses-list')
        const loadingIndicator = createElement('div', ['text-center', 'my-4'])
        loadingIndicator.id = 'infinite-loading'

        const spinner = createElement('div', ['spinner-border', 'text-primary'])
        spinner.setAttribute('role', 'status')
        const spinnerText = createElement('span', ['visually-hidden'])
        setText(spinnerText, 'Завантаження...')
        spinner.appendChild(spinnerText)

        const loadingText = createElement('div', ['mt-2', 'text-muted'])
        setText(loadingText, 'Завантаження курсів...')

        appendChildren(loadingIndicator, spinner, loadingText)

        // Додаємо індикатор перед sentinel
        sentinel.parentElement?.insertBefore(loadingIndicator, sentinel)

        // Симулюємо затримку завантаження
        await new Promise(resolve => setTimeout(resolve, 800))

        paginationState.currentPage++

        // Додаємо нові курси
        const coursesToAdd = getCoursesForPage(filteredCourses, paginationState.currentPage)

        coursesToAdd.forEach(course => {
          const card = createCourseCard(course)
          coursesList.appendChild(card)
        })

        // Видаляємо loading індикатор
        const loader = document.getElementById('infinite-loading')
        if (loader) {
          loader.remove()
        }

        paginationState.isLoading = false

        // Перевіряємо чи є ще курси
        const newLoadedCount = paginationState.currentPage * paginationState.itemsPerPage
        if (newLoadedCount >= filteredCourses.length) {
          paginationState.observer.disconnect()
          const endMessage = createElement('div', ['text-center', 'text-muted', 'my-4'])
          setText(endMessage, '✓ Всі курси завантажено')
          sentinel.replaceWith(endMessage)
        }
      }
    },
    {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    }
  )

  paginationState.observer.observe(sentinel)

  return sentinel
}

/**
 * Перемикач режиму пагінації
 */
function createPaginationModeSelector() {
  const container = createElement('div', ['pagination-mode-selector', 'mb-3'])
  container.style.cssText = 'display: flex; gap: 0.5rem; align-items: center; padding: 1rem; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;'

  const label = createElement('span', ['fw-bold'])
  setText(label, '📄 Режим відображення:')

  const btnGroup = createElement('div', ['btn-group', 'btn-group-sm'])
  btnGroup.setAttribute('role', 'group')

  const modes = [
    { value: 'pagination', label: 'Пагінація', icon: '📃' },
    { value: 'loadmore', label: 'Load More', icon: '⬇️' },
    { value: 'infinite', label: 'Infinite Scroll', icon: '∞' }
  ]

  modes.forEach(mode => {
    const btn = createElement('button', ['btn'])
    if (paginationState.mode === mode.value) {
      btn.classList.add('btn-primary')
    } else {
      btn.classList.add('btn-outline-primary')
    }
    setText(btn, `${mode.icon} ${mode.label}`)

    btn.addEventListener('click', () => {
      paginationState.mode = mode.value
      paginationState.currentPage = 1
      renderCourses()
      showNotification(`Режим змінено на: ${mode.label}`, 'info')

      console.log(`📄 Модуль 9: Режим пагінації змінено на "${mode.label}"`)
    })

    btnGroup.appendChild(btn)
  })

  appendChildren(container, label, btnGroup)
  return container
}

/**
 * Створює UI пагінації залежно від режиму
 */
function createPaginationUI(filteredCourses) {
  // Відключаємо Intersection Observer якщо він активний
  if (paginationState.observer) {
    paginationState.observer.disconnect()
    paginationState.observer = null
  }

  // Видаляємо ВСІ можливі елементи пагінації
  const elementsToRemove = [
    '.pagination-container',
    '#load-more-container',
    '#scroll-sentinel',
    '#infinite-loading',
    '.infinite-scroll-sentinel'
  ]

  elementsToRemove.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => el.remove())
  })

  // Створюємо відповідний UI залежно від режиму
  if (paginationState.mode === 'pagination') {
    return createPagination(filteredCourses)
  } else if (paginationState.mode === 'loadmore') {
    const loadMoreContainer = createLoadMoreButton(filteredCourses)
    loadMoreContainer.id = 'load-more-container'
    return loadMoreContainer
  } else if (paginationState.mode === 'infinite') {
    return setupInfiniteScroll(filteredCourses)
  }

  return null
}

// =========================================
// Фільтрація та сортування (Модуль 3)
// =========================================

/**
 * Фільтрація курсів за пошуковим запитом та статусом
 */
function getFilteredCourses() {
  let filtered = [...coursesData]

  // Фільтр за пошуком (input event)
  if (appState.searchQuery) {
    const query = appState.searchQuery.toLowerCase()
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(query) ||
      course.instructor.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    )
  }

  // Фільтр за статусом (change event)
  if (appState.filterEnrolled === 'enrolled') {
    filtered = filtered.filter(c => c.enrolled)
  } else if (appState.filterEnrolled === 'available') {
    filtered = filtered.filter(c => !c.enrolled)
  }

  // Сортування (click event)
  if (appState.sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (appState.sortBy === 'duration') {
    filtered.sort((a, b) => {
      const durationA = parseInt(a.duration) || 0
      const durationB = parseInt(b.duration) || 0
      return durationB - durationA
    })
  }

  return filtered
}

// =========================================
// Робота з масивами та об'єктами (Модуль 4)
// =========================================

/**
 * Розрахунок статистики за допомогою reduce
 */
function calculateStatistics() {
  // Використання reduce для підрахунку різних метрик
  const stats = coursesData.reduce((acc, course) => {
    // Деструктуризація (destructuring)
    const { enrolled, progress, lessons, isCustom } = course

    // Лічильники
    acc.totalCourses++
    if (enrolled) acc.enrolledCourses++
    if (isCustom) acc.customCourses++
    if (progress === 100) acc.completedCourses++

    // Підрахунок уроків
    acc.totalLessons += lessons.length
    acc.completedLessons += lessons.filter(l => l.completed).length

    // Сума прогресу для середнього
    if (enrolled) {
      acc.totalProgress += progress
    }

    return acc
  }, {
    totalCourses: 0,
    enrolledCourses: 0,
    customCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    totalProgress: 0
  })

  // Обчислюємо середній прогрес
  stats.avgProgress = stats.enrolledCourses > 0
    ? Math.round(stats.totalProgress / stats.enrolledCourses)
    : 0

  return stats
}

/**
 * Групування курсів за викладачами (використання reduce + Object)
 */
function groupCoursesByInstructor() {
  return coursesData.reduce((groups, course) => {
    const { instructor } = course

    // Якщо групи для викладача ще немає, створюємо
    if (!groups[instructor]) {
      groups[instructor] = []
    }

    // Додаємо курс до групи
    groups[instructor].push(course)

    return groups
  }, {})
}

/**
 * Топ викладачів за кількістю курсів (array methods chaining)
 */
function getTopInstructors() {
  // Object.entries для перетворення об'єкта в масив
  return Object.entries(groupCoursesByInstructor())
    // map для трансформації даних
    .map(([instructor, courses]) => ({
      instructor,
      coursesCount: courses.length,
      enrolledCount: courses.filter(c => c.enrolled).length,
      courses: courses.map(c => c.title) // витягуємо тільки назви
    }))
    // sort для сортування за кількістю курсів
    .sort((a, b) => b.coursesCount - a.coursesCount)
    // slice для отримання топ-3
    .slice(0, 3)
}

/**
 * Отримання унікальних викладачів (Set + spread operator)
 */
function getUniqueInstructors() {
  // Spread operator + Set для унікальних значень
  return [...new Set(coursesData.map(c => c.instructor))]
}

/**
 * Фільтрація курсів з умовами (some, every)
 */
function getCoursesAnalytics() {
  return {
    // some - чи є хоч один курс з прогресом 100%
    hasCompletedCourses: coursesData.some(c => c.progress === 100),

    // every - чи всі курси мають уроки
    allCoursesHaveLessons: coursesData.every(c => c.lessons && c.lessons.length > 0),

    // find - перший курс з прогресом > 0
    courseInProgress: coursesData.find(c => c.progress > 0 && c.progress < 100),

    // findIndex - індекс першого незаписаного курсу
    firstAvailableCourseIndex: coursesData.findIndex(c => !c.enrolled)
  }
}

/**
 * Клонування та модифікація об'єктів (spread operator)
 */
function cloneCourseWithProgress(courseId, newProgress) {
  const course = coursesData.find(c => c.id === courseId)

  if (!course) return null

  // Spread operator для створення копії + оновлення
  return {
    ...course,
    progress: newProgress,
    lessons: course.lessons.map(lesson => ({
      ...lesson,
      completed: newProgress === 100
    }))
  }
}

// =========================================
// Навігація між сторінками
// =========================================
function navigateTo(pageName) {
  // Приховуємо всі сторінки
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active')
  })

  // Видаляємо active клас з навігаційних посилань
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active')
  })

  // Показуємо потрібну сторінку
  const targetPage = document.getElementById(`${pageName}-page`)
  if (targetPage) {
    targetPage.classList.add('active')
    appState.currentPage = pageName
  }

  // Додаємо active клас до відповідного nav-link
  const activeLink = document.querySelector(`[data-page="${pageName}"]`)
  if (activeLink) {
    activeLink.classList.add('active')
  }

  // Оновлюємо вміст сторінки
  switch (pageName) {
    case 'courses':
      renderCourses()
      break
    case 'my-courses':
      renderMyCourses()
      break
    case 'progress':
      renderProgress()
      break
    case 'profile':
      renderProfile()
      break
  }
}

// =========================================
// Створення картки курсу через DOM API (Модуль 2)
// =========================================
function createCourseCard(course) {
  // Основний контейнер картки
  const card = createElement('div', ['course-card'], { 'data-course-id': course.id })

  // Зображення курсу
  const imageDiv = createElement('div', ['course-card-image'])
  setText(imageDiv, course.icon)

  // Контент картки
  const contentDiv = createElement('div', ['course-card-content'])

  // Заголовок
  const title = createElement('h3')
  setText(title, course.title)

  // Мета-інформація
  const metaDiv = createElement('div', ['course-card-meta'])
  const instructorSpan = createElement('span')
  setText(instructorSpan, `👨‍🏫 ${course.instructor}`)
  const durationSpan = createElement('span')
  setText(durationSpan, `⏱️ ${course.duration}`)
  appendChildren(metaDiv, instructorSpan, durationSpan)

  // Опис
  const description = createElement('p')
  setText(description, course.description)

  // Footer
  const footer = createElement('div', ['course-card-footer'])

  // Прогрес або порожній span
  let progressSpan
  if (course.enrolled) {
    progressSpan = createElement('span', ['course-progress'])
    setText(progressSpan, `${course.progress}% завершено`)
  } else {
    progressSpan = createElement('span')
  }

  // Кнопка
  const button = createElement('button', ['btn', 'btn-primary'])
  button.setAttribute('data-course-id', course.id)

  if (course.enrolled) {
    button.classList.add('btn-continue')
    setText(button, 'Продовжити')
  } else {
    button.classList.add('btn-enroll')
    setText(button, 'Записатись')
  }

  // Кнопка видалення для користувацьких курсів
  if (course.isCustom) {
    const deleteBtn = createElement('button', ['btn', 'btn-secondary'])
    deleteBtn.setAttribute('data-course-id', course.id)
    deleteBtn.classList.add('btn-delete')
    setText(deleteBtn, '🗑️ Видалити')
    deleteBtn.style.marginLeft = '0.5rem'
    appendChildren(footer, progressSpan, button, deleteBtn)
  } else {
    appendChildren(footer, progressSpan, button)
  }

  // Збираємо всі елементи разом
  appendChildren(contentDiv, title, metaDiv, description, footer)
  appendChildren(card, imageDiv, contentDiv)

  // Додаємо обробники подій
  card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn')) {
      showCourseDetail(course.id)
    }
  })

  // Обробник для кнопки запису/продовження
  button.addEventListener('click', (e) => {
    e.stopPropagation()
    if (course.enrolled) {
      showCourseDetail(course.id)
    } else {
      enrollCourse(course.id)
    }
  })

  // Обробник для кнопки видалення
  if (course.isCustom) {
    const deleteBtn = footer.querySelector('.btn-delete')
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      deleteCourse(course.id)
    })
  }

  return card
}

// =========================================
// Створення панелі пошуку та фільтрів (Модуль 3)
// =========================================
function createSearchAndFilters() {
  // Контейнер для всіх контролів
  const controlsDiv = createElement('div', [])
  controlsDiv.id = 'courses-controls'
  controlsDiv.style.cssText = 'background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 2rem;'

  // Верхній ряд: Кнопка створення та пошук
  const topRow = createElement('div', [])
  topRow.style.cssText = 'display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;'

  // Кнопка створення курсу (Bootstrap btn-success)
  const addCourseBtn = createElement('button', ['btn', 'btn-success', 'shadow-sm'])
  addCourseBtn.id = 'add-course-btn'
  setText(addCourseBtn, '➕ Створити курс')
  addCourseBtn.addEventListener('click', (e) => {
    e.preventDefault() // Модуль 3: preventDefault
    showCreateCourseForm()
  })

  // Кнопка завантаження курсів з API (Bootstrap btn-info)
  const loadFromAPIBtn = createElement('button', ['btn', 'btn-info', 'shadow-sm'])
  loadFromAPIBtn.id = 'load-api-btn'
  setText(loadFromAPIBtn, '🌐 Завантажити з API')
  loadFromAPIBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    loadFromAPIBtn.disabled = true
    setText(loadFromAPIBtn, '⏳ Завантаження...')

    try {
      await loadCoursesFromAPI()
    } catch (error) {
      // Помилка вже оброблена в loadCoursesFromAPI
    } finally {
      loadFromAPIBtn.disabled = false
      setText(loadFromAPIBtn, '🌐 Завантажити з API')
    }
  })

  // Поле пошуку (Bootstrap form-control)
  const searchInput = createElement('input', ['form-control', 'form-control-lg'])
  searchInput.type = 'text'
  searchInput.placeholder = '🔍 Пошук курсів...'
  searchInput.id = 'search-input'
  searchInput.style.cssText = 'flex: 1; min-width: 250px;'
  searchInput.value = appState.searchQuery

  // Обробник input події з debounce
  const handleSearch = debounce((e) => {
    appState.searchQuery = e.target.value
    renderCourses()
    dispatchCustomEvent('coursesFiltered', { query: appState.searchQuery })
  }, 300)

  searchInput.addEventListener('input', handleSearch)

  // Обробник keypress події (Enter для швидкого пошуку)
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      appState.searchQuery = e.target.value
      renderCourses()
    }
  })

  appendChildren(topRow, addCourseBtn, loadFromAPIBtn, searchInput)

  // Нижній ряд: Фільтри та сортування
  const bottomRow = createElement('div', [])
  bottomRow.style.cssText = 'display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;'

  // Фільтр за статусом (change event)
  const filterLabel = createElement('label', [])
  filterLabel.style.cssText = 'font-weight: 600; color: var(--text-color);'
  setText(filterLabel, 'Фільтр:')

  const filterSelect = createElement('select', ['form-select'])
  filterSelect.id = 'filter-select'

  const filterOptions = [
    { value: 'all', text: 'Всі курси' },
    { value: 'enrolled', text: 'Мої курси' },
    { value: 'available', text: 'Доступні' }
  ]

  filterOptions.forEach(opt => {
    const option = createElement('option', [])
    option.value = opt.value
    setText(option, opt.text)
    if (opt.value === appState.filterEnrolled) {
      option.selected = true
    }
    filterSelect.appendChild(option)
  })

  // Обробник change події
  filterSelect.addEventListener('change', (e) => {
    appState.filterEnrolled = e.target.value
    renderCourses()
    dispatchCustomEvent('coursesFiltered', { filter: appState.filterEnrolled })
  })

  // Сортування (click events)
  const sortLabel = createElement('label', [])
  sortLabel.style.cssText = 'font-weight: 600; color: var(--text-color); margin-left: 1rem;'
  setText(sortLabel, 'Сортування:')

  const sortSelect = createElement('select', ['form-select'])
  sortSelect.id = 'sort-select'

  const sortOptions = [
    { value: 'default', text: 'За замовчуванням' },
    { value: 'title', text: 'За назвою' },
    { value: 'duration', text: 'За тривалістю' }
  ]

  sortOptions.forEach(opt => {
    const option = createElement('option', [])
    option.value = opt.value
    setText(option, opt.text)
    if (opt.value === appState.sortBy) {
      option.selected = true
    }
    sortSelect.appendChild(option)
  })

  // Обробник change події для сортування
  sortSelect.addEventListener('change', (e) => {
    appState.sortBy = e.target.value
    renderCourses()
    dispatchCustomEvent('coursesSorted', { sortBy: appState.sortBy })
  })

  // Кнопка скидання фільтрів (click event)
  const resetBtn = createElement('button', ['btn', 'btn-secondary'])
  resetBtn.style.cssText = 'padding: 0.5rem 1rem; margin-left: auto;'
  setText(resetBtn, '🔄 Скинути')
  resetBtn.addEventListener('click', (e) => {
    e.preventDefault()
    appState.searchQuery = ''
    appState.filterEnrolled = 'all'
    appState.sortBy = 'default'
    renderCourses()
    dispatchCustomEvent('filtersReset', {})
  })

  appendChildren(bottomRow, filterLabel, filterSelect, sortLabel, sortSelect, resetBtn)
  // Третій ряд: API Demo кнопки (Модуль 7)
  const apiRow = createElement('div', [])
  apiRow.style.cssText = 'display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; padding-top: 1rem; border-top: 2px dashed var(--border-color);'

  const apiTitle = createElement('small', ['text-muted', 'w-100'])
  setText(apiTitle, '🧪 API Демонстрація (Модуль 7):')
  apiRow.appendChild(apiTitle)

  // Кнопка: Pagination
  const paginationBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-primary'])
  setText(paginationBtn, '📄 Pagination')
  paginationBtn.addEventListener('click', async () => {
    paginationBtn.disabled = true
    try {
      const result = await loadUsersWithPagination(1, 5)
      console.log('Users page 1:', result)
      showNotification(`Завантажено ${result.data.length} користувачів`, 'success')
    } catch (error) {
      // Handled
    } finally {
      paginationBtn.disabled = false
    }
  })

  // Кнопка: Cache Demo
  const cacheBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-secondary'])
  setText(cacheBtn, '📦 Cache Demo')
  cacheBtn.addEventListener('click', async () => {
    cacheBtn.disabled = true
    try {
      const data1 = await loadWithCache('/posts/1')
      setTimeout(async () => {
        const data2 = await loadWithCache('/posts/1')
        showNotification('Перевірте console - другий запит з кешу!', 'success')
        cacheBtn.disabled = false
      }, 1000)
    } catch (error) {
      cacheBtn.disabled = false
    }
  })

  // Кнопка: Batch Requests
  const batchBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-info'])
  setText(batchBtn, '📦 Batch Requests')
  batchBtn.addEventListener('click', async () => {
    batchBtn.disabled = true
    try {
      await batchLoadData(['/posts/1', '/posts/2', '/users/1'])
    } finally {
      batchBtn.disabled = false
    }
  })

  // Кнопка: Retry Demo
  const retryBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-warning'])
  setText(retryBtn, '🔄 Retry Demo')
  retryBtn.addEventListener('click', async () => {
    retryBtn.disabled = true
    try {
      // Симулюємо запит що може fail
      await fetchWithRetry('/posts/999')
    } catch (error) {
      showNotification('Retry вичерпано (перевірте console)', 'error')
    } finally {
      retryBtn.disabled = false
    }
  })

  // Кнопка: Clear Cache
  const clearCacheBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-danger'])
  setText(clearCacheBtn, '🗑️ Clear Cache')
  clearCacheBtn.addEventListener('click', clearAPICache)

  appendChildren(apiRow, paginationBtn, cacheBtn, batchBtn, retryBtn, clearCacheBtn)

  // Четвертий ряд: Error Handling Demo (Модуль 8)
  const errorRow = createElement('div', [])
  errorRow.style.cssText = 'display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; padding-top: 1rem; border-top: 2px dashed #dc3545;'

  const errorTitle = createElement('small', ['text-muted', 'w-100'])
  setText(errorTitle, '⚠️ Обробка помилок (Модуль 8):')
  errorRow.appendChild(errorTitle)

  // Кнопка: Test 404 Error
  const test404Btn = createElement('button', ['btn', 'btn-sm', 'btn-outline-danger'])
  setText(test404Btn, '🔍 Test 404')
  test404Btn.addEventListener('click', async () => {
    test404Btn.disabled = true
    try {
      await api.get('/nonexistent-resource-404')
    } catch (error) {
      console.log('✅ 404 Error caught:', error)
      showNotification('404 помилка успішно оброблена', 'info')
    } finally {
      test404Btn.disabled = false
    }
  })

  // Кнопка: Test Network Error
  const testNetworkBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-warning'])
  setText(testNetworkBtn, '📡 Test Network')
  testNetworkBtn.addEventListener('click', async () => {
    testNetworkBtn.disabled = true
    try {
      await api.get('https://invalid-domain-that-does-not-exist-12345.com/api')
    } catch (error) {
      console.log('✅ Network error caught:', error)
      showNotification('Мережева помилка оброблена', 'info')
    } finally {
      testNetworkBtn.disabled = false
    }
  })

  // Кнопка: View Error Log
  const viewLogBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-info'])
  setText(viewLogBtn, '📋 View Log')
  viewLogBtn.addEventListener('click', () => {
    const errors = errorLogger.getErrors()
    console.group('📋 Error Log')
    console.log(`Всього помилок: ${errors.length}`)
    errors.forEach((entry, index) => {
      console.log(`${index + 1}.`, entry.error.name, ':', entry.error.message)
    })
    console.groupEnd()
    showNotification(`Лог містить ${errors.length} помилок`, 'info')
  })

  // Кнопка: Error Stats
  const statsBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-secondary'])
  setText(statsBtn, '📊 Statistics')
  statsBtn.addEventListener('click', () => {
    const stats = errorLogger.getErrorStats()
    console.group('📊 Error Statistics')
    console.table(stats)
    console.groupEnd()
    showNotification('Статистика виведена в console', 'info')
  })

  // Кнопка: Clear Error Log
  const clearLogBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-dark'])
  setText(clearLogBtn, '🗑️ Clear Log')
  clearLogBtn.addEventListener('click', () => {
    errorLogger.clearErrors()
    showNotification('Лог помилок очищено', 'success')
  })

  // Кнопка: Trigger Validation Error
  const validationErrorBtn = createElement('button', ['btn', 'btn-sm', 'btn-outline-primary'])
  setText(validationErrorBtn, '✍️ Test Validation')
  validationErrorBtn.addEventListener('click', () => {
    try {
      throw new ValidationError('Email має бути у форматі user@example.com', 'email')
    } catch (error) {
      errorLogger.log(error, { trigger: 'manual_test' })
      showNotification('ValidationError створено', 'info')
    }
  })

  appendChildren(errorRow, test404Btn, testNetworkBtn, viewLogBtn, statsBtn, clearLogBtn, validationErrorBtn)
  appendChildren(controlsDiv, topRow, bottomRow, apiRow, errorRow)

  return controlsDiv
}

// =========================================
// Рендеринг списку курсів (оновлено для Модуля 3)
// =========================================
function renderCourses() {
  const coursesList = document.getElementById('courses-list')
  if (!coursesList) return

  // Очищаємо контейнер
  coursesList.innerHTML = ''

  // Видаляємо попередню панель контролів, якщо є
  const oldControls = document.getElementById('courses-controls')
  if (oldControls) {
    oldControls.remove()
  }

  // Додаємо панель пошуку та фільтрів
  const container = coursesList.parentElement
  const heading = container.querySelector('h2')
  const controlsPanel = createSearchAndFilters()

  if (heading && heading.nextSibling) {
    container.insertBefore(controlsPanel, heading.nextSibling)
  }

  // Отримуємо відфільтровані та відсортовані курси
  const filteredCourses = getFilteredCourses()

  // Видаляємо старий перемикач режиму, якщо є (Модуль 9)
  const oldModeSelector = document.getElementById('pagination-mode-selector')
  if (oldModeSelector) {
    oldModeSelector.remove()
  }

  // Додаємо перемикач режиму пагінації (Модуль 9)
  const modeSelector = createPaginationModeSelector()
  modeSelector.id = 'pagination-mode-selector'
  if (heading && heading.nextSibling) {
    const controlsNextSibling = controlsPanel.nextSibling
    container.insertBefore(modeSelector, controlsNextSibling)
  }

  // Якщо немає результатів
  if (filteredCourses.length === 0) {
    const emptyDiv = createElement('div', [])
    emptyDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px;'

    const emptyIcon = createElement('div', [])
    emptyIcon.style.cssText = 'font-size: 4rem; margin-bottom: 1rem;'
    setText(emptyIcon, '🔍')

    const emptyText = createElement('p', [])
    emptyText.style.cssText = 'font-size: 1.2rem; color: #6b7280;'
    setText(emptyText, 'Курсів не знайдено. Спробуйте змінити параметри пошуку.')

    appendChildren(emptyDiv, emptyIcon, emptyText)
    coursesList.appendChild(emptyDiv)
    return
  }

  // Модуль 9: Відображаємо курси залежно від режиму пагінації
  let coursesToRender = []

  if (paginationState.mode === 'pagination') {
    // Класична пагінація - показуємо лише курси для поточної сторінки
    coursesToRender = getCoursesForPage(filteredCourses, paginationState.currentPage)
  } else if (paginationState.mode === 'loadmore' || paginationState.mode === 'infinite') {
    // Load More та Infinite Scroll - показуємо курси від початку до поточної сторінки
    const endIndex = paginationState.currentPage * paginationState.itemsPerPage
    coursesToRender = filteredCourses.slice(0, endIndex)
  }

  // Створюємо та додаємо картки курсів через DOM API
  coursesToRender.forEach(course => {
    const card = createCourseCard(course)
    coursesList.appendChild(card)
  })

  // Показуємо кількість результатів
  updateResultsCount(filteredCourses.length)

  // Додаємо відповідний UI для пагінації (Модуль 9)
  const paginationUI = createPaginationUI(filteredCourses)
  if (paginationUI) {
    container.appendChild(paginationUI)
  }
}

// =========================================
// Оновлення лічильника результатів (Модуль 3)
// =========================================
function updateResultsCount(count) {
  const container = document.getElementById('courses-list').parentElement
  let countDiv = document.getElementById('results-count')

  if (!countDiv) {
    countDiv = createElement('div', [])
    countDiv.id = 'results-count'
    countDiv.style.cssText = 'margin-bottom: 1rem; color: #6b7280; font-weight: 600;'

    const coursesList = document.getElementById('courses-list')
    container.insertBefore(countDiv, coursesList)
  }

  setText(countDiv, `📚 Знайдено курсів: ${count}`)
}

// =========================================
// Запис на курс
// =========================================
function enrollCourse(courseId) {
  const course = coursesData.find(c => c.id === courseId)

  if (course) {
    course.enrolled = true
    renderCourses()
    showNotification(`Ви успішно записались на курс "${course.title}"!`, 'success')
  }
}

// =========================================
// Показати форму створення курсу (Модуль 2)
// =========================================
function showCreateCourseForm() {
  const container = document.getElementById('courses-list').parentElement

  // Перевіряємо, чи форма вже існує
  let formContainer = document.getElementById('create-course-form-container')

  if (formContainer) {
    // Якщо форма вже є, видаляємо її (toggle)
    formContainer.remove()
    return
  }

  // Створюємо контейнер форми через DOM API
  formContainer = createElement('div', [], { id: 'create-course-form-container' })
  formContainer.style.cssText = 'background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 2rem;'

  // Заголовок форми
  const formTitle = createElement('h3')
  setText(formTitle, '➕ Створити власний курс')
  formTitle.style.cssText = 'color: var(--primary-color); margin-bottom: 1.5rem;'

  // Форма
  const form = createElement('form', [], { id: 'create-course-form' })

  // Поле: Назва курсу
  const titleGroup = createFormGroup('Назва курсу', 'course-title', 'text', 'Наприклад: Python для Data Science')

  // Поле: Викладач
  const instructorGroup = createFormGroup('Викладач', 'course-instructor', 'text', 'Ваше ім\'я')

  // Поле: Тривалість
  const durationGroup = createFormGroup('Тривалість', 'course-duration', 'text', 'Наприклад: 10 годин')

  // Поле: Опис
  const descGroup = createElement('div', [])
  descGroup.style.marginBottom = '1rem'

  const descLabel = createElement('label')
  descLabel.setAttribute('for', 'course-description')
  setText(descLabel, 'Опис курсу')
  descLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'

  const descTextarea = createElement('textarea', [])
  descTextarea.id = 'course-description'
  descTextarea.setAttribute('placeholder', 'Короткий опис курсу...')
  descTextarea.setAttribute('rows', '3')
  descTextarea.setAttribute('required', 'true')
  descTextarea.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; font-family: inherit;'

  appendChildren(descGroup, descLabel, descTextarea)

  // Поле: Іконка (емодзі)
  const iconGroup = createFormGroup('Іконка (емодзі)', 'course-icon', 'text', '📚', false, 'maxlength="2"')

  // Кнопки
  const buttonsDiv = createElement('div', [])
  buttonsDiv.style.cssText = 'display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;'

  const cancelBtn = createElement('button', ['btn', 'btn-secondary'])
  cancelBtn.type = 'button'
  setText(cancelBtn, 'Скасувати')
  cancelBtn.addEventListener('click', () => formContainer.remove())

  const submitBtn = createElement('button', ['btn', 'btn-primary'])
  submitBtn.type = 'submit'
  setText(submitBtn, '✓ Створити курс')

  appendChildren(buttonsDiv, cancelBtn, submitBtn)

  // Збираємо форму
  appendChildren(form, titleGroup, instructorGroup, durationGroup, descGroup, iconGroup, buttonsDiv)

  // Обробник відправки форми з валідацією
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Валідація форми (Модуль 5)
    const isValid = validateForm(form, {
      'course-title': {
        minLength: 5,
        minLengthMessage: 'Назва курсу має містити мінімум 5 символів',
        maxLength: 100,
        maxLengthMessage: 'Назва курсу занадто довга (макс. 100 символів)'
      },
      'course-instructor': {
        minLength: 3,
        minLengthMessage: 'Ім\'я викладача має містити мінімум 3 символи'
      },
      'course-duration': {
        pattern: /\d+\s*(год|хв|год\.|хвилин|годин|hours?|minutes?)/i,
        patternMessage: 'Вкажіть тривалість у форматі "10 годин" або "45 хв"'
      },
      'course-description': {
        minLength: 20,
        minLengthMessage: 'Опис курсу має містити мінімум 20 символів',
        maxLength: 500,
        maxLengthMessage: 'Опис курсу занадто довгий (макс. 500 символів)'
      }
    })

    if (isValid) {
      createCourse(form)
    } else {
      showNotification('Будь ласка, виправте помилки у формі', 'error')
    }
  })

  // Додаємо real-time валідацію (Модуль 5)
  const titleInput = form.querySelector('#course-title')
  const instructorInput = form.querySelector('#course-instructor')
  const durationInput = form.querySelector('#course-duration')

  titleInput.setAttribute('data-label', 'Назва курсу')
  instructorInput.setAttribute('data-label', 'Викладач')
  durationInput.setAttribute('data-label', 'Тривалість')
  descTextarea.setAttribute('data-label', 'Опис курсу')

  addFieldValidation(titleInput, {
    minLength: 5,
    minLengthMessage: 'Назва курсу має містити мінімум 5 символів',
    maxLength: 100
  })

  addFieldValidation(instructorInput, {
    minLength: 3,
    minLengthMessage: 'Ім\'я викладача має містити мінімум 3 символи'
  })

  addFieldValidation(durationInput, {
    pattern: /\d+\s*(год|хв|год\.|хвилин|годин|hours?|minutes?)/i,
    patternMessage: 'Вкажіть тривалість у форматі "10 годин" або "45 хв"'
  })

  addFieldValidation(descTextarea, {
    minLength: 20,
    minLengthMessage: 'Опис курсу має містити мінімум 20 символів',
    maxLength: 500
  })

  // Збираємо контейнер
  appendChildren(formContainer, formTitle, form)

  // Вставляємо форму на початок контейнера сторінки курсів
  const coursesList = document.getElementById('courses-list')
  if (coursesList && coursesList.parentElement) {
    coursesList.parentElement.insertBefore(formContainer, coursesList)
  }
}

// =========================================
// Створення form group (helper)
// =========================================
function createFormGroup(labelText, inputId, inputType = 'text', placeholder = '', required = true, extraAttrs = '') {
  const group = createElement('div', [])
  group.style.marginBottom = '1rem'

  const label = createElement('label')
  label.setAttribute('for', inputId)
  setText(label, labelText)
  label.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'

  const input = createElement('input', [])
  input.id = inputId
  input.type = inputType
  input.setAttribute('placeholder', placeholder)
  if (required) input.setAttribute('required', 'true')
  if (extraAttrs) {
    extraAttrs.split(' ').forEach(attr => {
      const [key, value] = attr.split('=')
      input.setAttribute(key, value.replace(/"/g, ''))
    })
  }
  input.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px;'

  appendChildren(group, label, input)
  return group
}

// =========================================
// Створення нового курсу (Модуль 2 + Модуль 6)
// =========================================
async function createCourse(form) {
  const title = form.querySelector('#course-title').value
  const instructor = form.querySelector('#course-instructor').value
  const duration = form.querySelector('#course-duration').value
  const description = form.querySelector('#course-description').value
  const icon = form.querySelector('#course-icon').value || '📚'

  // Створюємо новий об'єкт курсу
  const newCourse = {
    id: appState.nextCourseId++,
    title,
    instructor,
    duration,
    description,
    icon,
    enrolled: false,
    progress: 0,
    isCustom: true, // Позначаємо як користувацький курс
    lessons: [
      {
        id: 1,
        title: 'Вступний урок',
        duration: '30 хв',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
    test: {
      id: appState.nextCourseId,
      questions: [
        {
          question: 'Чи сподобався вам курс?',
          options: ['Так', 'Дуже так', 'Неймовірно!', 'Супер!'],
          correct: 0
        }
      ]
    }
  }

  // Додаємо курс до масиву
  coursesData.push(newCourse)

  // Відправляємо курс на API (Модуль 6: Axios POST)
  try {
    await sendCourseToAPI(newCourse)
  } catch (error) {
    console.log('⚠️ Курс створено локально, але не відправлено на сервер')
  }

  // Видаляємо форму
  document.getElementById('create-course-form-container').remove()

  // Перерендерюємо список курсів
  renderCourses()

  showNotification(`Курс "${title}" успішно створено! 🎉`, 'success')
}

// =========================================
// Видалення курсу (Модуль 2)
// =========================================
function deleteCourse(courseId) {
  const course = coursesData.find(c => c.id === courseId)

  if (!course) return

  if (!course.isCustom) {
    showNotification('Можна видаляти лише власні курси!', 'error')
    return
  }

  // Підтвердження видалення
  if (!confirm(`Ви впевнені, що хочете видалити курс "${course.title}"?`)) {
    return
  }

  // Знаходимо індекс курсу
  const index = coursesData.findIndex(c => c.id === courseId)

  if (index !== -1) {
    // Видаляємо курс з масиву
    coursesData.splice(index, 1)

    // Перерендерюємо список
    renderCourses()

    showNotification(`Курс "${course.title}" видалено`, 'success')
  }
}

// =========================================
// Показати деталі курсу
// =========================================
function showCourseDetail(courseId) {
  const course = coursesData.find(c => c.id === courseId)

  if (!course) return

  appState.selectedCourseId = courseId

  const detailContent = document.getElementById('course-detail-content')

  detailContent.innerHTML = `
    <div class="course-detail">
      <div style="text-align: center; font-size: 5rem; margin-bottom: 1rem;">
        ${course.icon}
      </div>
      <h2>${course.title}</h2>
      <div class="course-card-meta" style="justify-content: center; margin-bottom: 2rem;">
        <span>👨‍🏫 ${course.instructor}</span>
        <span>⏱️ ${course.duration}</span>
        <span>${course.progress}% завершено</span>
      </div>
      <p style="font-size: 1.1rem; margin-bottom: 2rem;">${course.description}</p>

      ${!course.enrolled ? `
        <div style="text-align: center; margin-bottom: 2rem;">
          <button class="btn btn-primary" id="enroll-detail-btn" data-course-id="${course.id}">
            Записатись на курс
          </button>
        </div>
      ` : ''}

      <h3>📚 Уроки курсу</h3>
      <div class="lessons-list" style="margin-bottom: 2rem;">
        ${course.lessons.map((lesson, index) => `
          <div class="lesson-item" style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="margin-bottom: 0.5rem; color: var(--text-color);">
                ${lesson.completed ? '✅' : '📖'} ${index + 1}. ${lesson.title}
              </h4>
              <span style="color: #6b7280;">⏱️ ${lesson.duration}</span>
            </div>
            ${course.enrolled ? `
              <button class="btn btn-primary btn-watch-lesson" data-lesson-id="${lesson.id}" data-course-id="${course.id}">
                ${lesson.completed ? 'Переглянути знову' : 'Почати урок'}
              </button>
            ` : `
              <span style="color: #6b7280;">🔒 Недоступно</span>
            `}
          </div>
        `).join('')}
      </div>

      ${course.enrolled ? `
        <div style="text-align: center;">
          <button class="btn btn-primary" id="start-test-btn" data-course-id="${course.id}">
            📝 Пройти тест
          </button>
        </div>
      ` : ''}
    </div>
  `

  // Обробник для кнопки запису
  const enrollBtn = detailContent.querySelector('#enroll-detail-btn')
  if (enrollBtn) {
    enrollBtn.addEventListener('click', () => {
      enrollCourse(courseId)
      showCourseDetail(courseId) // Перерендерити
    })
  }

  // Обробники для кнопок уроків
  detailContent.querySelectorAll('.btn-watch-lesson').forEach(btn => {
    btn.addEventListener('click', () => {
      const lessonId = parseInt(btn.dataset.lessonId)
      watchLesson(courseId, lessonId)
    })
  })

  // Обробник для кнопки тесту
  const testBtn = detailContent.querySelector('#start-test-btn')
  if (testBtn) {
    testBtn.addEventListener('click', () => {
      startTest(courseId)
    })
  }

  navigateTo('course-detail')
}

// =========================================
// Перегляд уроку
// =========================================
function watchLesson(courseId, lessonId) {
  const course = coursesData.find(c => c.id === courseId)
  const lesson = course?.lessons.find(l => l.id === lessonId)

  if (!course || !lesson) return

  const detailContent = document.getElementById('course-detail-content')

  detailContent.innerHTML = `
    <div class="lesson-viewer">
      <h2>${lesson.title}</h2>
      <p style="color: #6b7280; margin-bottom: 2rem;">⏱️ ${lesson.duration}</p>

      <div style="position: relative; padding-bottom: 56.25%; height: 0; margin-bottom: 2rem; border-radius: 12px; overflow: hidden;">
        <iframe
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
          src="${lesson.videoUrl}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-back" id="back-to-course">← Назад до курсу</button>
        ${!lesson.completed ? `
          <button class="btn btn-primary" id="complete-lesson-btn">✓ Позначити як завершений</button>
        ` : `
          <span style="color: var(--success-color); font-weight: 600;">✅ Урок завершено</span>
        `}
      </div>
    </div>
  `

  // Обробник для кнопки "Назад"
  detailContent.querySelector('#back-to-course').addEventListener('click', () => {
    showCourseDetail(courseId)
  })

  // Обробник для кнопки "Завершити урок"
  const completeBtn = detailContent.querySelector('#complete-lesson-btn')
  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      completeLesson(courseId, lessonId)
    })
  }
}

// =========================================
// Завершення уроку
// =========================================
function completeLesson(courseId, lessonId) {
  const course = coursesData.find(c => c.id === courseId)
  const lesson = course?.lessons.find(l => l.id === lessonId)

  if (!course || !lesson) return

  lesson.completed = true

  // Оновлюємо прогрес курсу
  const completedLessons = course.lessons.filter(l => l.completed).length
  course.progress = Math.round((completedLessons / course.lessons.length) * 100)

  showNotification('Урок завершено! 🎉', 'success')
  watchLesson(courseId, lessonId) // Перерендерити
}

// =========================================
// Початок тесту
// =========================================
function startTest(courseId) {
  const course = coursesData.find(c => c.id === courseId)

  if (!course || !course.test) return

  appState.currentTestId = course.test.id
  appState.userAnswers = []

  const testContent = document.getElementById('test-content')

  testContent.innerHTML = `
    <div class="test-container">
      <h2>📝 Тест: ${course.title}</h2>
      <p style="color: #6b7280; margin-bottom: 2rem;">Відповідьте на всі питання та натисніть "Завершити тест"</p>

      <form id="test-form">
        ${course.test.questions.map((q, qIndex) => `
          <div class="test-question" style="background: white; padding: 2rem; margin-bottom: 1.5rem; border-radius: 12px; box-shadow: var(--shadow);">
            <h3 style="margin-bottom: 1.5rem; color: var(--text-color);">
              Питання ${qIndex + 1}: ${q.question}
            </h3>
            ${q.options.map((option, oIndex) => `
              <label style="display: block; padding: 1rem; margin-bottom: 0.5rem; background: #f9fafb; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                <input type="radio" name="question-${qIndex}" value="${oIndex}" style="margin-right: 0.5rem;">
                ${option}
              </label>
            `).join('')}
          </div>
        `).join('')}

        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button type="button" class="btn btn-back" id="cancel-test">Скасувати</button>
          <button type="submit" class="btn btn-primary">✓ Завершити тест</button>
        </div>
      </form>
    </div>
  `

  // Обробник для форми тесту
  const form = testContent.querySelector('#test-form')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    submitTest(courseId)
  })

  // Обробник для кнопки скасування
  testContent.querySelector('#cancel-test').addEventListener('click', () => {
    showCourseDetail(courseId)
  })

  navigateTo('test')
}

// =========================================
// Відправка тесту
// =========================================
function submitTest(courseId) {
  const course = coursesData.find(c => c.id === courseId)
  const form = document.getElementById('test-form')

  if (!course || !form) return

  let score = 0
  const answers = []

  course.test.questions.forEach((q, index) => {
    const selected = form.querySelector(`input[name="question-${index}"]:checked`)
    const userAnswer = selected ? parseInt(selected.value) : -1

    answers.push({
      question: q.question,
      userAnswer,
      correctAnswer: q.correct,
      isCorrect: userAnswer === q.correct
    })

    if (userAnswer === q.correct) {
      score++
    }
  })

  const percentage = Math.round((score / course.test.questions.length) * 100)

  // Показуємо результат
  const testContent = document.getElementById('test-content')

  testContent.innerHTML = `
    <div class="test-result" style="text-align: center;">
      <div style="font-size: 5rem; margin-bottom: 1rem;">
        ${percentage >= 70 ? '🎉' : '📚'}
      </div>
      <h2 style="color: ${percentage >= 70 ? 'var(--success-color)' : 'var(--warning-color)'};">
        ${percentage >= 70 ? 'Вітаємо! Тест складено!' : 'Потрібно попрацювати ще'}
      </h2>
      <p style="font-size: 2rem; font-weight: 700; margin: 1.5rem 0;">
        ${score} з ${course.test.questions.length} правильних (${percentage}%)
      </p>

      <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow); margin: 2rem 0; text-align: left;">
        <h3 style="margin-bottom: 1.5rem; text-align: center;">Результати по питаннях:</h3>
        ${answers.map((a, index) => `
          <div style="padding: 1rem; margin-bottom: 1rem; background: ${a.isCorrect ? '#f0fdf4' : '#fef2f2'}; border-left: 4px solid ${a.isCorrect ? 'var(--success-color)' : 'var(--danger-color)'}; border-radius: 8px;">
            <strong>Питання ${index + 1}:</strong> ${a.question}<br>
            <span style="color: ${a.isCorrect ? 'var(--success-color)' : 'var(--danger-color)'};">
              ${a.isCorrect ? '✅ Правильно' : '❌ Неправильно'}
            </span>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-back" id="back-to-course">← Назад до курсу</button>
        ${percentage < 70 ? `
          <button class="btn btn-primary" id="retry-test">🔄 Спробувати ще раз</button>
        ` : ''}
      </div>
    </div>
  `

  // Обробники
  testContent.querySelector('#back-to-course').addEventListener('click', () => {
    showCourseDetail(courseId)
  })

  const retryBtn = testContent.querySelector('#retry-test')
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      startTest(courseId)
    })
  }

  if (percentage >= 70) {
    showNotification(`Тест складено успішно! ${percentage}%`, 'success')
  }
}

// =========================================
// Рендеринг моїх курсів (оновлено для Модуля 2)
// =========================================
function renderMyCourses() {
  const myCoursesList = document.getElementById('my-courses-list')

  if (!myCoursesList) return

  // Очищаємо контейнер
  myCoursesList.innerHTML = ''

  const enrolledCourses = coursesData.filter(c => c.enrolled)

  if (enrolledCourses.length === 0) {
    // Створюємо повідомлення через DOM API
    const emptyDiv = createElement('div', [])
    emptyDiv.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem;'

    const message = createElement('p', [])
    message.style.cssText = 'font-size: 1.2rem; color: #6b7280;'
    setText(message, 'Ви ще не записані на жоден курс. Перейдіть до ')

    const link = createElement('a', [])
    link.href = '#'
    link.setAttribute('data-page', 'courses')
    link.style.color = 'var(--primary-color)'
    setText(link, 'каталогу курсів')

    link.addEventListener('click', (e) => {
      e.preventDefault()
      navigateTo('courses')
    })

    message.appendChild(link)
    message.appendChild(document.createTextNode('.'))
    emptyDiv.appendChild(message)
    myCoursesList.appendChild(emptyDiv)
    return
  }

  // Створюємо картки через DOM API
  enrolledCourses.forEach(course => {
    const card = createCourseCard(course)
    myCoursesList.appendChild(card)
  })
}

// =========================================
// Рендеринг прогресу (оновлено для Модуля 4)
// =========================================
function renderProgress() {
  const progressStats = document.getElementById('progress-stats')
  if (!progressStats) return

  // Очищаємо контейнер
  progressStats.innerHTML = ''

  // Модуль 4: Використання reduce, map, filter
  const stats = calculateStatistics()
  const topInstructors = getTopInstructors()
  const analytics = getCoursesAnalytics()

  // Основна статистика (використання деструктуризації)
  const {
    totalCourses,
    enrolledCourses,
    completedCourses,
    customCourses,
    totalLessons,
    completedLessons,
    avgProgress
  } = stats

  // Секція 1: Загальна статистика (Grid з карток)
  const statsSection = createElement('div', [])
  statsSection.style.cssText = 'margin-bottom: 2rem;'

  const statsTitle = createElement('h3', [])
  setText(statsTitle, '📊 Загальна статистика')
  statsTitle.style.cssText = 'margin-bottom: 1.5rem; color: var(--primary-color);'

  const statsGrid = createElement('div', [])
  statsGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;'

  // Масив статистичних карток (демонстрація map)
  const statsCards = [
    { icon: '📚', value: totalCourses, label: 'Всього курсів', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { icon: '✅', value: enrolledCourses, label: 'Записано', gradient: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' },
    { icon: '🎯', value: completedCourses, label: 'Завершено', gradient: 'linear-gradient(135deg, var(--success-color), #059669)' },
    { icon: '⭐', value: customCourses, label: 'Власних', gradient: 'linear-gradient(135deg, var(--warning-color), #d97706)' },
    { icon: '📖', value: totalLessons, label: 'Всього уроків', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { icon: '✓', value: completedLessons, label: 'Уроків пройдено', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' }
  ]

  // Використання map для створення карток
  statsCards.forEach(({ icon, value, label, gradient }) => {
    const card = createElement('div', [])
    card.style.cssText = `background: ${gradient}; color: white; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: var(--shadow);`

    const iconDiv = createElement('div', [])
    setText(iconDiv, icon)
    iconDiv.style.cssText = 'font-size: 2rem; margin-bottom: 0.5rem;'

    const valueDiv = createElement('div', [])
    setText(valueDiv, value.toString())
    valueDiv.style.cssText = 'font-size: 2.5rem; font-weight: 700; margin-bottom: 0.25rem;'

    const labelDiv = createElement('div', [])
    setText(labelDiv, label)
    labelDiv.style.cssText = 'opacity: 0.9; font-size: 0.875rem;'

    appendChildren(card, iconDiv, valueDiv, labelDiv)
    statsGrid.appendChild(card)
  })

  appendChildren(statsSection, statsTitle, statsGrid)

  // Секція 2: Топ викладачів (використання Object.entries, map, sort, slice)
  if (topInstructors.length > 0) {
    const instructorsSection = createElement('div', [])
    instructorsSection.style.cssText = 'margin-bottom: 2rem;'

    const instructorsTitle = createElement('h3', [])
    setText(instructorsTitle, '👨‍🏫 Топ викладачів')
    instructorsTitle.style.cssText = 'margin-bottom: 1.5rem; color: var(--primary-color);'

    const instructorsGrid = createElement('div', [])
    instructorsGrid.style.cssText = 'display: grid; gap: 1rem;'

    // Використання forEach з деструктуризацією
    topInstructors.forEach(({ instructor, coursesCount, enrolledCount, courses }, index) => {
      const card = createElement('div', [])
      card.style.cssText = 'background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow);'

      const header = createElement('div', [])
      header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;'

      const nameDiv = createElement('div', [])
      nameDiv.style.cssText = 'font-weight: 700; color: var(--text-color); font-size: 1.1rem;'
      setText(nameDiv, `${index + 1}. ${instructor}`)

      const badge = createElement('span', [])
      badge.style.cssText = 'background: var(--primary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.875rem;'
      setText(badge, `${coursesCount} курс${coursesCount > 1 ? 'и' : ''}`)

      appendChildren(header, nameDiv, badge)

      const info = createElement('div', [])
      info.style.cssText = 'color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;'
      setText(info, `Записано на ${enrolledCount} з ${coursesCount}`)

      // Список курсів (використання join)
      const coursesList = createElement('div', [])
      coursesList.style.cssText = 'color: #6b7280; font-size: 0.875rem;'
      setText(coursesList, courses.join(', '))

      appendChildren(card, header, info, coursesList)
      instructorsGrid.appendChild(card)
    })

    appendChildren(instructorsSection, instructorsTitle, instructorsGrid)
    progressStats.appendChild(instructorsSection)
  }

  // Секція 3: Прогрес по курсах (filter + map)
  const myEnrolledCourses = coursesData.filter(c => c.enrolled)

  if (myEnrolledCourses.length > 0) {
    const coursesSection = createElement('div', [])
    coursesSection.style.cssText = 'margin-bottom: 2rem;'

    const coursesTitle = createElement('h3', [])
    setText(coursesTitle, `📈 Детальний прогрес (${avgProgress}% середній)`)
    coursesTitle.style.cssText = 'margin-bottom: 1.5rem; color: var(--primary-color);'

    // Використання map для створення прогрес-барів
    myEnrolledCourses.forEach(course => {
      const progressCard = createElement('div', [])
      progressCard.style.cssText = 'background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; box-shadow: var(--shadow);'

      const headerDiv = createElement('div', [])
      headerDiv.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;'

      const titleDiv = createElement('h4', [])
      titleDiv.style.cssText = 'margin: 0; color: var(--text-color);'
      setText(titleDiv, `${course.icon} ${course.title}`)

      const percentDiv = createElement('span', [])
      percentDiv.style.cssText = 'font-weight: 700; color: var(--primary-color);'
      setText(percentDiv, `${course.progress}%`)

      appendChildren(headerDiv, titleDiv, percentDiv)

      // Прогрес-бар
      const progressBar = createElement('div', [])
      progressBar.style.cssText = 'background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden;'

      const progressFill = createElement('div', [])
      progressFill.style.cssText = `background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); height: 100%; width: ${course.progress}%; transition: width 0.3s ease;`

      progressBar.appendChild(progressFill)

      // Інфо про уроки (використання filter)
      const lessonsInfo = createElement('div', [])
      lessonsInfo.style.cssText = 'margin-top: 0.5rem; color: #6b7280; font-size: 0.875rem;'
      const completedCount = course.lessons.filter(l => l.completed).length
      setText(lessonsInfo, `${completedCount} з ${course.lessons.length} уроків завершено`)

      appendChildren(progressCard, headerDiv, progressBar, lessonsInfo)
      coursesSection.appendChild(progressCard)
    })

    appendChildren(coursesSection, coursesTitle)
    progressStats.appendChild(coursesSection)
  }

  // Додаємо всі секції
  progressStats.insertBefore(statsSection, progressStats.firstChild)

  // Якщо немає записаних курсів
  if (enrolledCourses.length === 0) {
    const emptyDiv = createElement('div', [])
    emptyDiv.style.cssText = 'text-align: center; padding: 3rem; background: white; border-radius: 12px; margin-top: 2rem;'

    const emptyIcon = createElement('div', [])
    emptyIcon.style.cssText = 'font-size: 4rem; margin-bottom: 1rem;'
    setText(emptyIcon, '📚')

    const emptyText = createElement('p', [])
    emptyText.style.cssText = 'font-size: 1.2rem; color: #6b7280;'
    setText(emptyText, 'Почніть навчання, щоб побачити свій прогрес! ')

    const link = createElement('a', [])
    link.href = '#'
    link.setAttribute('data-page', 'courses')
    link.style.color = 'var(--primary-color)'
    setText(link, 'Переглянути курси')

    link.addEventListener('click', (e) => {
      e.preventDefault()
      navigateTo('courses')
    })

    emptyText.appendChild(link)
    appendChildren(emptyDiv, emptyIcon, emptyText)
    progressStats.appendChild(emptyDiv)
  }

  // Консольний вивід аналітики (для демонстрації)
  console.log('📊 Модуль 4: Аналітика курсів')
  console.log('Статистика:', stats)
  console.log('Топ викладачів:', topInstructors)
  console.log('Унікальні викладачі:', getUniqueInstructors())
  console.log('Аналітика:', analytics)
}

// =========================================
// Рендеринг профілю (Модуль 5)
// =========================================
function renderProfile() {
  const profileContent = document.getElementById('profile-content')
  if (!profileContent) return

  profileContent.innerHTML = ''

  // Контейнер форми
  const formContainer = createElement('div', [])
  formContainer.style.cssText = 'max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: var(--shadow);'

  // Заголовок
  const formTitle = createElement('h3')
  setText(formTitle, '✏️ Редагувати профіль')
  formTitle.style.cssText = 'color: var(--primary-color); margin-bottom: 1.5rem;'

  // Форма
  const form = createElement('form', [], { id: 'profile-form', novalidate: 'true' })

  // Секція: Особиста інформація
  const personalSection = createElement('div', [])
  personalSection.style.marginBottom = '2rem'

  const personalTitle = createElement('h4')
  setText(personalTitle, '👤 Особиста інформація')
  personalTitle.style.cssText = 'color: var(--text-color); margin-bottom: 1rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem;'

  // Поле: Ім'я (text, required, minlength)
  const nameGroup = createElement('div', [])
  nameGroup.style.marginBottom = '1rem'
  const nameLabel = createElement('label', [], { for: 'profile-name' })
  setText(nameLabel, 'Повне ім\'я *')
  nameLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const nameInput = createElement('input', [], {
    type: 'text',
    id: 'profile-name',
    placeholder: 'Іван Петренко',
    required: 'true',
    minlength: '3',
    'data-label': 'Ім\'я'
  })
  nameInput.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'
  appendChildren(nameGroup, nameLabel, nameInput)

  // Поле: Email (email, required)
  const emailGroup = createElement('div', [])
  emailGroup.style.marginBottom = '1rem'
  const emailLabel = createElement('label', [], { for: 'profile-email' })
  setText(emailLabel, 'Email *')
  emailLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const emailInput = createElement('input', [], {
    type: 'email',
    id: 'profile-email',
    placeholder: 'ivan@example.com',
    required: 'true',
    'data-label': 'Email'
  })
  emailInput.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'
  appendChildren(emailGroup, emailLabel, emailInput)

  // Поле: Телефон (tel, pattern)
  const phoneGroup = createElement('div', [])
  phoneGroup.style.marginBottom = '1rem'
  const phoneLabel = createElement('label', [], { for: 'profile-phone' })
  setText(phoneLabel, 'Телефон')
  phoneLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const phoneInput = createElement('input', [], {
    type: 'tel',
    id: 'profile-phone',
    placeholder: '+380 (XX) XXX-XX-XX',
    pattern: '\\+?[0-9\\s\\(\\)\\-]{10,}',
    'data-label': 'Телефон',
    'data-pattern-message': 'Введіть коректний номер телефону'
  })
  phoneInput.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'
  appendChildren(phoneGroup, phoneLabel, phoneInput)

  // Поле: Дата народження (date, max)
  const birthdateGroup = createElement('div', [])
  birthdateGroup.style.marginBottom = '1rem'
  const birthdateLabel = createElement('label', [], { for: 'profile-birthdate' })
  setText(birthdateLabel, 'Дата народження')
  birthdateLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const birthdateInput = createElement('input', [], {
    type: 'date',
    id: 'profile-birthdate',
    max: new Date().toISOString().split('T')[0], // Не може бути в майбутньому
    'data-label': 'Дата народження'
  })
  birthdateInput.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'
  appendChildren(birthdateGroup, birthdateLabel, birthdateInput)

  appendChildren(personalSection, personalTitle, nameGroup, emailGroup, phoneGroup, birthdateGroup)

  // Секція: Навчальні налаштування
  const studySection = createElement('div', [])
  studySection.style.marginBottom = '2rem'

  const studyTitle = createElement('h4')
  setText(studyTitle, '🎓 Навчальні налаштування')
  studyTitle.style.cssText = 'color: var(--text-color); margin-bottom: 1rem; border-bottom: 2px solid var(--primary-color); padding-bottom: 0.5rem;'

  // Поле: Рівень (select, required)
  const levelGroup = createElement('div', [])
  levelGroup.style.marginBottom = '1rem'
  const levelLabel = createElement('label', [], { for: 'profile-level' })
  setText(levelLabel, 'Рівень підготовки *')
  levelLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const levelSelect = createElement('select', [], {
    id: 'profile-level',
    required: 'true',
    'data-label': 'Рівень підготовки'
  })
  levelSelect.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'

  const levels = ['', 'Початківець', 'Середній', 'Досвідчений', 'Експерт']
  levels.forEach(level => {
    const option = createElement('option', [], { value: level.toLowerCase() })
    setText(option, level || '-- Оберіть рівень --')
    if (level === '') option.disabled = true
    levelSelect.appendChild(option)
  })
  appendChildren(levelGroup, levelLabel, levelSelect)

  // Поле: Годин навчання на тиждень (number, min, max)
  const hoursGroup = createElement('div', [])
  hoursGroup.style.marginBottom = '1rem'
  const hoursLabel = createElement('label', [], { for: 'profile-hours' })
  setText(hoursLabel, 'Годин навчання на тиждень')
  hoursLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const hoursInput = createElement('input', [], {
    type: 'number',
    id: 'profile-hours',
    min: '1',
    max: '168',
    step: '1',
    placeholder: '10',
    'data-label': 'Годин на тиждень'
  })
  hoursInput.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'
  appendChildren(hoursGroup, hoursLabel, hoursInput)

  // Поле: Мотивація (range + display)
  const motivationGroup = createElement('div', [])
  motivationGroup.style.marginBottom = '1rem'
  const motivationLabel = createElement('label', [], { for: 'profile-motivation' })
  setText(motivationLabel, 'Рівень мотивації')
  motivationLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'

  const motivationDisplay = createElement('span', [])
  setText(motivationDisplay, '50%')
  motivationDisplay.style.cssText = 'float: right; color: var(--primary-color); font-weight: 700;'

  const motivationInput = createElement('input', [], {
    type: 'range',
    id: 'profile-motivation',
    min: '0',
    max: '100',
    value: '50',
    step: '10',
    'data-label': 'Мотивація'
  })
  motivationInput.style.cssText = 'width: 100%; margin-top: 0.5rem;'

  // Update display on range change
  motivationInput.addEventListener('input', (e) => {
    setText(motivationDisplay, `${e.target.value}%`)
  })

  const motivationLabelContainer = createElement('div', [])
  motivationLabelContainer.style.display = 'flex'
  motivationLabelContainer.style.justifyContent = 'space-between'
  appendChildren(motivationLabelContainer, motivationLabel, motivationDisplay)

  appendChildren(motivationGroup, motivationLabelContainer, motivationInput)

  // Поле: URL особистого сайту (url)
  const websiteGroup = createElement('div', [])
  websiteGroup.style.marginBottom = '1rem'
  const websiteLabel = createElement('label', [], { for: 'profile-website' })
  setText(websiteLabel, 'Особистий сайт/портфоліо')
  websiteLabel.style.cssText = 'display: block; margin-bottom: 0.5rem; font-weight: 600;'
  const websiteInput = createElement('input', [], {
    type: 'url',
    id: 'profile-website',
    placeholder: 'https://myportfolio.com',
    'data-label': 'Веб-сайт'
  })
  websiteInput.style.cssText = 'width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; transition: border-color 0.3s;'
  appendChildren(websiteGroup, websiteLabel, websiteInput)

  // Поле: Сповіщення (checkbox)
  const notificationsGroup = createElement('div', [])
  notificationsGroup.style.marginBottom = '1rem'
  const notificationsLabel = createElement('label', [])
  notificationsLabel.style.cssText = 'display: flex; align-items: center; cursor: pointer;'

  const notificationsCheckbox = createElement('input', [], {
    type: 'checkbox',
    id: 'profile-notifications',
    checked: 'true'
  })
  notificationsCheckbox.style.cssText = 'width: 20px; height: 20px; margin-right: 0.5rem; cursor: pointer;'

  const notificationsText = createElement('span', [])
  setText(notificationsText, 'Отримувати email сповіщення про нові курси')

  appendChildren(notificationsLabel, notificationsCheckbox, notificationsText)
  appendChildren(notificationsGroup, notificationsLabel)

  appendChildren(studySection, studyTitle, levelGroup, hoursGroup, motivationGroup, websiteGroup, notificationsGroup)

  // Кнопки
  const buttonsDiv = createElement('div', [])
  buttonsDiv.style.cssText = 'display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid var(--border-color);'

  const resetBtn = createElement('button', ['btn', 'btn-secondary'], { type: 'reset' })
  setText(resetBtn, 'Скинути')

  const submitBtn = createElement('button', ['btn', 'btn-primary'], { type: 'submit' })
  setText(submitBtn, '💾 Зберегти профіль')

  appendChildren(buttonsDiv, resetBtn, submitBtn)

  // Збираємо форму
  appendChildren(form, personalSection, studySection, buttonsDiv)

  // Обробник відправки форми з валідацією
  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Валідація форми (Модуль 5)
    const isValid = validateForm(form, {
      'profile-name': {
        minLength: 3,
        minLengthMessage: 'Ім\'я має містити мінімум 3 символи'
      },
      'profile-hours': {
        min: 1,
        max: 168,
        minMessage: 'Мінімум 1 година на тиждень',
        maxMessage: 'Максимум 168 годин на тиждень'
      }
    })

    if (isValid) {
      const formData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        birthdate: birthdateInput.value,
        level: levelSelect.value,
        hours: hoursInput.value,
        motivation: motivationInput.value,
        website: websiteInput.value,
        notifications: notificationsCheckbox.checked
      }

      console.log('📝 Модуль 5: Дані профілю', formData)
      showNotification('Профіль успішно збережено! 🎉', 'success')

      // Демонстрація використання FormData API
      const formDataAPI = new FormData(form)
      console.log('📋 FormData entries:')
      for (const [key, value] of formDataAPI.entries()) {
        console.log(`${key}: ${value}`)
      }
    } else {
      showNotification('Будь ласка, виправте помилки у формі', 'error')
    }
  })

  // Real-time валідація (Модуль 5)
  addFieldValidation(nameInput, {
    minLength: 3,
    minLengthMessage: 'Ім\'я має містити мінімум 3 символи'
  })

  addFieldValidation(emailInput, {})

  addFieldValidation(phoneInput, {}, false) // Валідація тільки на blur

  addFieldValidation(websiteInput, {}, false)

  addFieldValidation(hoursInput, {
    min: 1,
    max: 168,
    minMessage: 'Мінімум 1 година',
    maxMessage: 'Максимум 168 годин'
  })

  // Збираємо контейнер
  appendChildren(formContainer, formTitle, form)
  profileContent.appendChild(formContainer)

  console.log('📝 Модуль 5: Форма профілю з валідацією створена')
}

// =========================================
// Показати сповіщення (Модуль 6: Bootstrap Toast)
// =========================================
function showNotification(message, type = 'success') {
  // Створюємо контейнер для тостів, якщо його немає
  let toastContainer = document.getElementById('toast-container')
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3'
    toastContainer.style.zIndex = '9999'
    document.body.appendChild(toastContainer)
  }

  // Визначаємо колір залежно від типу
  const bgColor = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info'

  // Створюємо Bootstrap Toast
  const toastEl = createElement('div', ['toast', 'align-items-center', 'text-white', bgColor, 'border-0'])
  toastEl.setAttribute('role', 'alert')
  toastEl.setAttribute('aria-live', 'assertive')
  toastEl.setAttribute('aria-atomic', 'true')

  const toastBody = createElement('div', ['d-flex'])

  const messageDiv = createElement('div', ['toast-body'])
  setText(messageDiv, message)

  const closeBtn = createElement('button', ['btn-close', 'btn-close-white', 'me-2', 'm-auto'])
  closeBtn.type = 'button'
  closeBtn.setAttribute('data-bs-dismiss', 'toast')
  closeBtn.setAttribute('aria-label', 'Close')

  appendChildren(toastBody, messageDiv, closeBtn)
  toastEl.appendChild(toastBody)
  toastContainer.appendChild(toastEl)

  // Ініціалізуємо та показуємо Toast через Bootstrap API
  const toast = new bootstrap.Toast(toastEl, {
    autohide: true,
    delay: 3000
  })

  toast.show()

  // Видаляємо елемент після приховування
  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove()
  })
}

// =========================================
// Ініціалізація додатку
// =========================================
function initApp() {
  // Навігаційні посилання
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const page = link.dataset.page
      navigateTo(page)
    })
  })

  // Кнопка "Назад до курсів"
  const backBtn = document.getElementById('back-to-courses')
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      navigateTo('courses')
    })
  }

  // =========================================
  // Модуль 3: Клавіатурна навігація та події
  // =========================================

  // Глобальна клавіатурна навігація (keydown event)
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K - фокус на пошук
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const searchInput = document.getElementById('search-input')
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    }

    // Escape - скинути пошук або закрити форму
    if (e.key === 'Escape') {
      const formContainer = document.getElementById('create-course-form-container')
      if (formContainer) {
        formContainer.remove()
      } else {
        const searchInput = document.getElementById('search-input')
        if (searchInput && searchInput.value) {
          searchInput.value = ''
          appState.searchQuery = ''
          renderCourses()
        }
      }
    }

    // Цифри 1-4 - швидка навігація по сторінках
    if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey) {
      const target = e.target
      // Не спрацьовує, якщо ми в полі вводу
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return
      }

      const pages = ['courses', 'my-courses', 'progress', 'profile']
      const pageIndex = parseInt(e.key) - 1
      if (pages[pageIndex]) {
        navigateTo(pages[pageIndex])
      }
    }
  })

  // Слухачі власних подій (CustomEvent)
  document.addEventListener('coursesFiltered', (e) => {
    console.log('🔍 Курси відфільтровано:', e.detail)
  })

  document.addEventListener('coursesSorted', (e) => {
    console.log('🔄 Курси відсортовано:', e.detail)
  })

  document.addEventListener('filtersReset', () => {
    console.log('♻️ Фільтри скинуто')
  })

  // Делегування подій для динамічних елементів (mouseover/mouseout)
  const app = document.getElementById('app')
  app.addEventListener('mouseover', (e) => {
    // Якщо це картка курсу
    if (e.target.closest('.course-card')) {
      const card = e.target.closest('.course-card')
      // Додаємо ефект підсвічування
      card.style.borderLeft = '4px solid var(--primary-color)'
    }
  })

  app.addEventListener('mouseout', (e) => {
    // Якщо це картка курсу
    if (e.target.closest('.course-card')) {
      const card = e.target.closest('.course-card')
      // Прибираємо ефект
      card.style.borderLeft = 'none'
    }
  })

  // Початкова сторінка - курси
  renderCourses()

  console.log('✅ E-learning Platform ініціалізовано')
  console.log('📚 Доступно курсів:', coursesData.length)
  console.log('⌨️ Клавіатурні скорочення:')
  console.log('  • Ctrl/Cmd + K - Фокус на пошук')
  console.log('  • Escape - Скинути пошук або закрити форму')
  console.log('  • 1-4 - Перехід між сторінками')
  console.log('⚠️ Модуль 8: Обробка помилок активна')
  console.log('  • Global error handlers: ✅')
  console.log('  • ErrorLogger: ✅')
  console.log('  • Custom Error classes: ✅')
  console.log('  • Axios interceptors: ✅')
  console.log('  • Form validation logging: ✅')
  console.log('📄 Модуль 9: Пагінація та нескінченний скрол активні')
  console.log('  • Режим пагінації: ' + paginationState.mode)
  console.log('  • Курсів на сторінку: ' + paginationState.itemsPerPage)
  console.log('  • Доступні режими: Пагінація, Load More, Infinite Scroll')
  console.log('  • Intersection Observer API: ✅')
}

// Запускаємо додаток після завантаження DOM
document.addEventListener('DOMContentLoaded', initApp)
