import { generateId } from "./utils.js";

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {Date} date
 * @property {number} amount
 * @property {string} category
 * @property {string} description
 */

/** @type {Transaction[]} */
export const transactions = [];

/**
 * Создаёт объект транзакции и добавляет в массив.
 * @param {{amount: number, category: string, description: string}} data
 * @returns {Transaction}
 */
export function addTransaction(data) {
  const transaction = {
    id: generateId(),
    date: new Date(),
    amount: data.amount,
    category: data.category,
    description: data.description,
  };
  transactions.push(transaction);
  return transaction;
}

/**
 * Удаляет транзакцию по id.
 * @param {string} id
 */
export function deleteTransaction(id) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index !== -1) {
    transactions.splice(index, 1);
  }
}

/**
 * Ищет транзакцию по id.
 * @param {string} id
 * @returns {Transaction|undefined}
 */
export function findTransaction(id) {
  return transactions.find((t) => t.id === id);
}

/**
 * Подсчитывает общую сумму транзакций.
 * @returns {number}
 */
export function calculateTotal() {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
