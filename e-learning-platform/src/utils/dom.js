/**
 * DOM Утиліти (Модуль 2)
 */

/**
 * Створює елемент з класами та атрибутами
 */
export function createElement(tag, classes = [], attributes = {}) {
  const element = document.createElement(tag)

  // Додаємо класи
  if (classes.length > 0) {
    element.classList.add(...classes)
  }

  // Додаємо атрибути
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })

  return element
}

/**
 * Встановлює текстовий вміст елемента
 */
export function setText(element, text) {
  element.textContent = text
}

/**
 * Додає дочірні елементи
 */
export function appendChildren(parent, ...children) {
  children.forEach(child => {
    if (child) {
      parent.appendChild(child)
    }
  })
}

/**
 * Очищає вміст елемента
 */
export function clearElement(element) {
  element.innerHTML = ''
}

/**
 * Показує/ховає елемент
 */
export function toggleElement(element, show) {
  element.style.display = show ? 'block' : 'none'
}

/**
 * Знаходить елемент за селектором
 */
export function $(selector) {
  return document.querySelector(selector)
}

/**
 * Знаходить всі елементи за селектором
 */
export function $$(selector) {
  return document.querySelectorAll(selector)
}
