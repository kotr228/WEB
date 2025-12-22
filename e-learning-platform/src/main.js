import './style.css'

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
  nextCourseId: 7, // Для генерації ID нових курсів
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

  // Кнопка створення курсу
  const addCourseBtn = createElement('button', ['btn', 'btn-primary'])
  addCourseBtn.id = 'add-course-btn'
  setText(addCourseBtn, '➕ Створити курс')
  addCourseBtn.addEventListener('click', (e) => {
    e.preventDefault() // Модуль 3: preventDefault
    showCreateCourseForm()
  })

  // Поле пошуку (input event + debounce)
  const searchInput = createElement('input', [])
  searchInput.type = 'text'
  searchInput.placeholder = '🔍 Пошук курсів...'
  searchInput.id = 'search-input'
  searchInput.style.cssText = 'flex: 1; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; min-width: 250px;'
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

  appendChildren(topRow, addCourseBtn, searchInput)

  // Нижній ряд: Фільтри та сортування
  const bottomRow = createElement('div', [])
  bottomRow.style.cssText = 'display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;'

  // Фільтр за статусом (change event)
  const filterLabel = createElement('label', [])
  filterLabel.style.cssText = 'font-weight: 600; color: var(--text-color);'
  setText(filterLabel, 'Фільтр:')

  const filterSelect = createElement('select', [])
  filterSelect.id = 'filter-select'
  filterSelect.style.cssText = 'padding: 0.5rem; border: 2px solid var(--border-color); border-radius: 8px; cursor: pointer;'

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

  const sortSelect = createElement('select', [])
  sortSelect.id = 'sort-select'
  sortSelect.style.cssText = 'padding: 0.5rem; border: 2px solid var(--border-color); border-radius: 8px; cursor: pointer;'

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
  appendChildren(controlsDiv, topRow, bottomRow)

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

  // Створюємо та додаємо картки курсів через DOM API
  filteredCourses.forEach(course => {
    const card = createCourseCard(course)
    coursesList.appendChild(card)
  })

  // Показуємо кількість результатів
  updateResultsCount(filteredCourses.length)
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

  // Обробник відправки форми
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    createCourse(form)
  })

  // Збираємо контейнер
  appendChildren(formContainer, formTitle, form)

  // Вставляємо форму після кнопки "Додати курс"
  const addBtn = document.getElementById('add-course-btn')
  if (addBtn && addBtn.nextSibling) {
    container.insertBefore(formContainer, addBtn.nextSibling)
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
// Створення нового курсу (Модуль 2)
// =========================================
function createCourse(form) {
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
  const enrolledCourses = coursesData.filter(c => c.enrolled)

  if (enrolledCourses.length > 0) {
    const coursesSection = createElement('div', [])
    coursesSection.style.cssText = 'margin-bottom: 2rem;'

    const coursesTitle = createElement('h3', [])
    setText(coursesTitle, `📈 Детальний прогрес (${avgProgress}% середній)`)
    coursesTitle.style.cssText = 'margin-bottom: 1.5rem; color: var(--primary-color);'

    // Використання map для створення прогрес-барів
    enrolledCourses.forEach(course => {
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
// Показати сповіщення
// =========================================
function showNotification(message, type = 'success') {
  // Видаляємо попереднє сповіщення, якщо є
  const existing = document.querySelector('.notification')
  if (existing) {
    existing.remove()
  }

  const notification = document.createElement('div')
  notification.className = `notification ${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // Показуємо з анімацією
  setTimeout(() => {
    notification.classList.add('show')
  }, 100)

  // Приховуємо через 3 секунди
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 3000)
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

    // Цифри 1-3 - швидка навігація по сторінках
    if (e.key >= '1' && e.key <= '3' && !e.ctrlKey && !e.metaKey) {
      const target = e.target
      // Не спрацьовує, якщо ми в полі вводу
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      const pages = ['courses', 'my-courses', 'progress']
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
  console.log('  • 1-3 - Перехід між сторінками')
}

// Запускаємо додаток після завантаження DOM
document.addEventListener('DOMContentLoaded', initApp)
