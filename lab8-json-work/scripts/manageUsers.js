#!/usr/bin/env node

/**
 * Завдання 1: Управління списком користувачів
 * Скрипт для додавання нових користувачів до файлу users.json
 */

const fs = require('fs');
const path = require('path');

// Шляхи до файлів
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

/**
 * Генерація випадкового ID
 */
function generateId(existingUsers) {
  if (existingUsers.length === 0) return 1;
  const maxId = Math.max(...existingUsers.map(u => u.id));
  return maxId + 1;
}

/**
 * Читання користувачів з файлу
 */
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Помилка читання файлу:', error.message);
    return [];
  }
}

/**
 * Запис користувачів у файл
 */
function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    console.log('✓ Дані успішно записано у файл');
  } catch (error) {
    console.error('Помилка запису файлу:', error.message);
  }
}

/**
 * Додавання нового користувача
 */
function addUser(name, email) {
  // Валідація
  if (!name || !email) {
    console.error('❌ Помилка: необхідно вказати ім\'я та email');
    console.log('Використання: node manageUsers.js <ім\'я> <email>');
    return;
  }

  // Проста валідація email
  if (!email.includes('@')) {
    console.error('❌ Помилка: некоректний формат email');
    return;
  }

  // Читання існуючих користувачів
  const users = readUsers();

  // Перевірка на дублікат email
  if (users.some(u => u.email === email)) {
    console.error(`❌ Користувач з email ${email} вже існує`);
    return;
  }

  // Створення нового користувача
  const newUser = {
    id: generateId(users),
    name: name,
    email: email
  };

  // Додавання користувача
  users.push(newUser);

  // Запис у файл
  writeUsers(users);

  console.log('\n✓ Новий користувач доданий:');
  console.log(`  ID: ${newUser.id}`);
  console.log(`  Ім'я: ${newUser.name}`);
  console.log(`  Email: ${newUser.email}`);
}

/**
 * Виведення всіх користувачів
 */
function listUsers() {
  const users = readUsers();

  console.log('\n📋 Список всіх користувачів:\n');
  console.log('ID | Ім\'я                    | Email');
  console.log('---+------------------------+--------------------------------');

  users.forEach(user => {
    const id = String(user.id).padEnd(2);
    const name = user.name.padEnd(23);
    console.log(`${id} | ${name} | ${user.email}`);
  });

  console.log(`\n📊 Всього користувачів: ${users.length}\n`);
}

/**
 * Головна функція
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Якщо аргументів немає, просто виводимо список
    listUsers();
  } else if (args.length >= 2) {
    // Якщо є аргументи, додаємо користувача
    const name = args[0];
    const email = args[1];
    addUser(name, email);

    // Виводимо оновлений список
    listUsers();
  } else {
    console.log('❌ Помилка: недостатньо аргументів');
    console.log('\nВикористання:');
    console.log('  node manageUsers.js                    # Показати список');
    console.log('  node manageUsers.js <ім\'я> <email>     # Додати користувача');
    console.log('\nПриклад:');
    console.log('  node manageUsers.js "Петро Іванов" petro@example.com');
  }
}

// Запуск програми
main();
