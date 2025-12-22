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
  userAnswers: []
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
// Рендеринг списку курсів
// =========================================
function renderCourses() {
  const coursesList = document.getElementById('courses-list')

  if (!coursesList) return

  coursesList.innerHTML = coursesData.map(course => `
    <div class="course-card" data-course-id="${course.id}">
      <div class="course-card-image">
        ${course.icon}
      </div>
      <div class="course-card-content">
        <h3>${course.title}</h3>
        <div class="course-card-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span>⏱️ ${course.duration}</span>
        </div>
        <p>${course.description}</p>
        <div class="course-card-footer">
          ${course.enrolled
            ? `<span class="course-progress">${course.progress}% завершено</span>`
            : '<span></span>'
          }
          <button class="btn btn-primary ${course.enrolled ? 'btn-continue' : 'btn-enroll'}"
                  data-course-id="${course.id}">
            ${course.enrolled ? 'Продовжити' : 'Записатись'}
          </button>
        </div>
      </div>
    </div>
  `).join('')

  // Додаємо обробники подій
  coursesList.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn')) {
        const courseId = parseInt(card.dataset.courseId)
        showCourseDetail(courseId)
      }
    })
  })

  coursesList.querySelectorAll('.btn-enroll').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const courseId = parseInt(btn.dataset.courseId)
      enrollCourse(courseId)
    })
  })

  coursesList.querySelectorAll('.btn-continue').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const courseId = parseInt(btn.dataset.courseId)
      showCourseDetail(courseId)
    })
  })
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
// Рендеринг моїх курсів
// =========================================
function renderMyCourses() {
  const myCoursesList = document.getElementById('my-courses-list')

  if (!myCoursesList) return

  const enrolledCourses = coursesData.filter(c => c.enrolled)

  if (enrolledCourses.length === 0) {
    myCoursesList.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="font-size: 1.2rem; color: #6b7280;">
          Ви ще не записані на жоден курс. Перейдіть до <a href="#" data-page="courses" style="color: var(--primary-color);">каталогу курсів</a>.
        </p>
      </div>
    `

    myCoursesList.querySelector('a[data-page="courses"]').addEventListener('click', (e) => {
      e.preventDefault()
      navigateTo('courses')
    })
    return
  }

  myCoursesList.innerHTML = enrolledCourses.map(course => `
    <div class="course-card" data-course-id="${course.id}">
      <div class="course-card-image">
        ${course.icon}
      </div>
      <div class="course-card-content">
        <h3>${course.title}</h3>
        <div class="course-card-meta">
          <span>👨‍🏫 ${course.instructor}</span>
          <span>⏱️ ${course.duration}</span>
        </div>
        <p>${course.description}</p>
        <div class="course-card-footer">
          <span class="course-progress">${course.progress}% завершено</span>
          <button class="btn btn-primary btn-continue" data-course-id="${course.id}">
            Продовжити
          </button>
        </div>
      </div>
    </div>
  `).join('')

  // Обробники подій
  myCoursesList.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn')) {
        const courseId = parseInt(card.dataset.courseId)
        showCourseDetail(courseId)
      }
    })
  })

  myCoursesList.querySelectorAll('.btn-continue').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const courseId = parseInt(btn.dataset.courseId)
      showCourseDetail(courseId)
    })
  })
}

// =========================================
// Рендеринг прогресу
// =========================================
function renderProgress() {
  const progressStats = document.getElementById('progress-stats')

  if (!progressStats) return

  const enrolledCourses = coursesData.filter(c => c.enrolled)
  const totalCourses = enrolledCourses.length
  const completedCourses = enrolledCourses.filter(c => c.progress === 100).length
  const avgProgress = totalCourses > 0
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / totalCourses)
    : 0

  progressStats.innerHTML = `
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
      <div style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; padding: 2rem; border-radius: 12px; text-align: center;">
        <div style="font-size: 3rem; font-weight: 700;">${totalCourses}</div>
        <div style="opacity: 0.9;">Всього курсів</div>
      </div>
      <div style="background: linear-gradient(135deg, var(--success-color), #059669); color: white; padding: 2rem; border-radius: 12px; text-align: center;">
        <div style="font-size: 3rem; font-weight: 700;">${completedCourses}</div>
        <div style="opacity: 0.9;">Завершено</div>
      </div>
      <div style="background: linear-gradient(135deg, var(--warning-color), #d97706); color: white; padding: 2rem; border-radius: 12px; text-align: center;">
        <div style="font-size: 3rem; font-weight: 700;">${avgProgress}%</div>
        <div style="opacity: 0.9;">Середній прогрес</div>
      </div>
    </div>

    ${enrolledCourses.length > 0 ? `
      <h3 style="margin-bottom: 1.5rem;">Детальний прогрес по курсах:</h3>
      ${enrolledCourses.map(course => `
        <div style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 12px; box-shadow: var(--shadow);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h4 style="margin: 0; color: var(--text-color);">${course.icon} ${course.title}</h4>
            <span style="font-weight: 700; color: var(--primary-color);">${course.progress}%</span>
          </div>
          <div style="background: #e5e7eb; height: 12px; border-radius: 6px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); height: 100%; width: ${course.progress}%; transition: width 0.3s ease;"></div>
          </div>
          <div style="margin-top: 0.5rem; color: #6b7280; font-size: 0.875rem;">
            ${course.lessons.filter(l => l.completed).length} з ${course.lessons.length} уроків завершено
          </div>
        </div>
      `).join('')}
    ` : `
      <div style="text-align: center; padding: 3rem; background: white; border-radius: 12px;">
        <p style="font-size: 1.2rem; color: #6b7280;">
          Почніть навчання, щоб побачити свій прогрес!
          <a href="#" data-page="courses" style="color: var(--primary-color);">Переглянути курси</a>
        </p>
      </div>
    `}
  `

  // Обробник для посилання на курси
  const link = progressStats.querySelector('a[data-page="courses"]')
  if (link) {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      navigateTo('courses')
    })
  }
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

  // Початкова сторінка - курси
  renderCourses()

  console.log('✅ E-learning Platform ініціалізовано')
  console.log('📚 Доступно курсів:', coursesData.length)
}

// Запускаємо додаток після завантаження DOM
document.addEventListener('DOMContentLoaded', initApp)
