#!/usr/bin/env node

/**
 * Завдання 2: Злиття двох JSON-файлів
 * Скрипт для об'єднання products1.json та products2.json
 */

const fs = require('fs');
const path = require('path');

// Шляхи до файлів
const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS1_FILE = path.join(DATA_DIR, 'products1.json');
const PRODUCTS2_FILE = path.join(DATA_DIR, 'products2.json');
const COMBINED_FILE = path.join(DATA_DIR, 'products_combined.json');

/**
 * Читання JSON файлу
 */
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Помилка читання файлу ${path.basename(filePath)}:`, error.message);
    return [];
  }
}

/**
 * Запис JSON файлу
 */
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Дані записано у файл ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Помилка запису файлу ${path.basename(filePath)}:`, error.message);
  }
}

/**
 * Об'єднання масивів з видаленням дублікатів за ID
 */
function mergeProducts(products1, products2) {
  // Створюємо Map для швидкого пошуку за ID
  const productMap = new Map();

  // Додаємо продукти з першого масиву
  products1.forEach(product => {
    productMap.set(product.id, product);
  });

  // Додаємо продукти з другого масиву (дублікати будуть перезаписані)
  products2.forEach(product => {
    if (!productMap.has(product.id)) {
      productMap.set(product.id, product);
    }
  });

  // Конвертуємо Map назад у масив
  return Array.from(productMap.values());
}

/**
 * Сортування продуктів за ціною (від меншої до більшої)
 */
function sortByPrice(products) {
  return products.sort((a, b) => a.price - b.price);
}

/**
 * Форматований вивід продуктів
 */
function displayProducts(products, title) {
  console.log(`\n${title}\n`);
  console.log('ID | Назва                           | Ціна (грн)');
  console.log('---+---------------------------------+-----------');

  products.forEach(product => {
    const id = String(product.id).padEnd(2);
    const name = product.name.padEnd(31);
    const price = String(product.price).padStart(9);
    console.log(`${id} | ${name} | ${price}`);
  });

  console.log();
}

/**
 * Головна функція
 */
function main() {
  console.log('🔄 Об\'єднання файлів products1.json та products2.json\n');

  // Читаємо обидва файли
  const products1 = readJSON(PRODUCTS1_FILE);
  const products2 = readJSON(PRODUCTS2_FILE);

  console.log(`📦 Завантажено з products1.json: ${products1.length} товарів`);
  console.log(`📦 Завантажено з products2.json: ${products2.length} товарів`);

  // Виводимо вміст обох файлів
  displayProducts(products1, '📋 Товари з products1.json:');
  displayProducts(products2, '📋 Товари з products2.json:');

  // Об'єднуємо масиви
  const merged = mergeProducts(products1, products2);
  const duplicatesRemoved = (products1.length + products2.length) - merged.length;

  console.log(`\n🔗 Об'єднано товарів: ${merged.length}`);
  console.log(`♻️  Видалено дублікатів: ${duplicatesRemoved}\n`);

  // Сортуємо за ціною
  const sorted = sortByPrice(merged);

  // Виводимо результат
  displayProducts(sorted, '✨ Фінальний список (відсортовано за ціною):');

  // Зберігаємо результат
  writeJSON(COMBINED_FILE, sorted);

  // Статистика
  console.log('\n📊 Статистика:');
  const totalPrice = sorted.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = totalPrice / sorted.length;
  const minPrice = sorted[0].price;
  const maxPrice = sorted[sorted.length - 1].price;

  console.log(`   Загальна вартість: ${totalPrice} грн`);
  console.log(`   Середня ціна: ${avgPrice.toFixed(2)} грн`);
  console.log(`   Найдешевший: ${sorted[0].name} (${minPrice} грн)`);
  console.log(`   Найдорожчий: ${sorted[sorted.length - 1].name} (${maxPrice} грн)`);
  console.log();
}

// Запуск програми
main();
