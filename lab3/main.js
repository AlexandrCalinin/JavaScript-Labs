/**
 * @typedef {Object} Transaction
 * @property {string} transaction_id
 * @property {string} transaction_date  - в формате YYYY-MM-DD.
 * @property {number} transaction_amount
 * @property {"debit"|"credit"} transaction_type
 * @property {string} transaction_description
 * @property {string} merchant_name
 * @property {"credit"|"debit"} card_type
 */

/** @type {Transaction[]} */
const transactions = [
  {
    transaction_id: "1",
    transaction_date: "2024-01-05",
    transaction_amount: 120.5,
    transaction_type: "debit",
    transaction_description: "Покупка продуктов",
    merchant_name: "Local Market",
    card_type: "debit",
  },
  {
    transaction_id: "2",
    transaction_date: "2024-01-10",
    transaction_amount: 50,
    transaction_type: "credit",
    transaction_description: "Возврат за товар",
    merchant_name: "Online Shop",
    card_type: "credit",
  },
  {
    transaction_id: "3",
    transaction_date: "2024-02-01",
    transaction_amount: 1500,
    transaction_type: "debit",
    transaction_description: "Оплата аренды",
    merchant_name: "Landlord",
    card_type: "debit",
  },
  {
    transaction_id: "4",
    transaction_date: "2024-02-15",
    transaction_amount: 300,
    transaction_type: "debit",
    transaction_description: "Кофе и обед",
    merchant_name: "Cafe Central",
    card_type: "credit",
  },
  {
    transaction_id: "5",
    transaction_date: "2024-02-20",
    transaction_amount: 75,
    transaction_type: "credit",
    transaction_description: "Кэшбэк",
    merchant_name: "Bank",
    card_type: "credit",
  },
  {
    transaction_id: "6",
    transaction_date: "2024-03-03",
    transaction_amount: 200,
    transaction_type: "debit",
    transaction_description: "Книги",
    merchant_name: "Bookstore",
    card_type: "debit",
  },
  {
    transaction_id: "7",
    transaction_date: "2024-03-12",
    transaction_amount: 45,
    transaction_type: "debit",
    transaction_description: "Такси",
    merchant_name: "Taxi",
    card_type: "credit",
  },
];

/**
 * Возвращает массив уникальных типов транзакций.
 * @param {Transaction[]} transactions
 * @returns {string[]}
 */
function getUniqueTransactionTypes(transactions) {
  const set = new Set();
  for (const t of transactions) {
    set.add(t.transaction_type);
  }
  return [...set];
}

/**
 * Сумма всех транзакций.
 * @param {Transaction[]} transactions
 * @returns {number}
 */
function calculateTotalAmount(transactions) {
  return transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
}

/**
 * Сумма транзакций за указанный год/месяц/день. Все параметры необязательны.
 * @param {Transaction[]} transactions
 * @param {number} [year]
 * @param {number} [month] - 1..12
 * @param {number} [day]
 * @returns {number}
 */
function calculateTotalAmountByDate(transactions, year, month, day) {
  return transactions
    .filter((t) => {
      const d = new Date(t.transaction_date);
      if (year !== undefined && d.getFullYear() !== year) return false;
      if (month !== undefined && d.getMonth() + 1 !== month) return false;
      if (day !== undefined && d.getDate() !== day) return false;
      return true;
    })
    .reduce((sum, t) => sum + t.transaction_amount, 0);
}

/**
 * Транзакции указанного типа.
 * @param {Transaction[]} transactions
 * @param {"debit"|"credit"} type
 * @returns {Transaction[]}
 */
function getTransactionByType(transactions, type) {
  return transactions.filter((t) => t.transaction_type === type);
}

/**
 * Транзакции в указанном диапазоне дат (включительно).
 * @param {Transaction[]} transactions
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {Transaction[]}
 */
function getTransactionsInDateRange(transactions, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return transactions.filter((t) => {
    const d = new Date(t.transaction_date);
    return d >= start && d <= end;
  });
}

/**
 * Транзакции по названию мерчанта.
 * @param {Transaction[]} transactions
 * @param {string} merchantName
 * @returns {Transaction[]}
 */
function getTransactionsByMerchant(transactions, merchantName) {
  return transactions.filter((t) => t.merchant_name === merchantName);
}

/**
 * Среднее значение транзакций.
 * @param {Transaction[]} transactions
 * @returns {number}
 */
function calculateAverageTransactionAmount(transactions) {
  if (transactions.length === 0) return 0;
  return calculateTotalAmount(transactions) / transactions.length;
}

/**
 * Транзакции с суммой в диапазоне [minAmount, maxAmount].
 * @param {Transaction[]} transactions
 * @param {number} minAmount
 * @param {number} maxAmount
 * @returns {Transaction[]}
 */
function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
  return transactions.filter(
    (t) => t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount
  );
}

/**
 * Общая сумма дебетовых транзакций.
 * @param {Transaction[]} transactions
 * @returns {number}
 */
function calculateTotalDebitAmount(transactions) {
  return getTransactionByType(transactions, "debit").reduce(
    (sum, t) => sum + t.transaction_amount,
    0
  );
}

/**
 * Месяц (1..12) с наибольшим числом транзакций.
 * @param {Transaction[]} transactions
 * @returns {number|null}
 */
function findMostTransactionsMonth(transactions) {
  if (transactions.length === 0) return null;
  const counts = {};
  for (const t of transactions) {
    const m = new Date(t.transaction_date).getMonth() + 1;
    counts[m] = (counts[m] || 0) + 1;
  }
  let bestMonth = null;
  let bestCount = -1;
  for (const m in counts) {
    if (counts[m] > bestCount) {
      bestCount = counts[m];
      bestMonth = Number(m);
    }
  }
  return bestMonth;
}

/**
 * Месяц с наибольшим числом дебетовых транзакций.
 * @param {Transaction[]} transactions
 * @returns {number|null}
 */
function findMostDebitTransactionMonth(transactions) {
  return findMostTransactionsMonth(
    getTransactionByType(transactions, "debit")
  );
}

/**
 * Какого типа транзакций больше.
 * @param {Transaction[]} transactions
 * @returns {"debit"|"credit"|"equal"}
 */
function mostTransactionTypes(transactions) {
  const debit = getTransactionByType(transactions, "debit").length;
  const credit = getTransactionByType(transactions, "credit").length;
  if (debit > credit) return "debit";
  if (credit > debit) return "credit";
  return "equal";
}

/**
 * Транзакции, совершённые до указанной даты.
 * @param {Transaction[]} transactions
 * @param {string} date - YYYY-MM-DD
 * @returns {Transaction[]}
 */
function getTransactionsBeforeDate(transactions, date) {
  const target = new Date(date);
  return transactions.filter((t) => new Date(t.transaction_date) < target);
}

/**
 * Найти транзакцию по id.
 * @param {Transaction[]} transactions
 * @param {string} id
 * @returns {Transaction|undefined}
 */
function findTransactionById(transactions, id) {
  return transactions.find((t) => t.transaction_id === id);
}

/**
 * Массив только из описаний транзакций.
 * @param {Transaction[]} transactions
 * @returns {string[]}
 */
function mapTransactionDescriptions(transactions) {
  return transactions.map((t) => t.transaction_description);
}

// ----- Тесты -----
console.log("Уникальные типы:", getUniqueTransactionTypes(transactions));
console.log("Общая сумма:", calculateTotalAmount(transactions));
console.log("Сумма за февраль 2024:", calculateTotalAmountByDate(transactions, 2024, 2));
console.log("Сумма за 2024 год:", calculateTotalAmountByDate(transactions, 2024));
console.log("Дебетовые транзакции:", getTransactionByType(transactions, "debit"));
console.log(
  "Диапазон 2024-02-01..2024-02-28:",
  getTransactionsInDateRange(transactions, "2024-02-01", "2024-02-28")
);
console.log("По мерчанту 'Cafe Central':", getTransactionsByMerchant(transactions, "Cafe Central"));
console.log("Среднее значение:", calculateAverageTransactionAmount(transactions));
console.log("Сумма в диапазоне 50..200:", getTransactionsByAmountRange(transactions, 50, 200));
console.log("Сумма дебетовых:", calculateTotalDebitAmount(transactions));
console.log("Месяц с макс. транзакциями:", findMostTransactionsMonth(transactions));
console.log("Месяц с макс. дебетом:", findMostDebitTransactionMonth(transactions));
console.log("Каких больше:", mostTransactionTypes(transactions));
console.log("До 2024-02-15:", getTransactionsBeforeDate(transactions, "2024-02-15"));
console.log("Найти по id=3:", findTransactionById(transactions, "3"));
console.log("Только описания:", mapTransactionDescriptions(transactions));

// Граничные случаи
console.log("\n--- Граничные случаи ---");
console.log("Пустой массив, сумма:", calculateTotalAmount([]));
console.log("Пустой массив, среднее:", calculateAverageTransactionAmount([]));
console.log("Пустой массив, mostTransactionTypes:", mostTransactionTypes([]));
console.log("Пустой массив, findMostTransactionsMonth:", findMostTransactionsMonth([]));

const single = [transactions[0]];
console.log("Один элемент, сумма:", calculateTotalAmount(single));
console.log("Один элемент, среднее:", calculateAverageTransactionAmount(single));
console.log("Один элемент, mostTransactionTypes:", mostTransactionTypes(single));
