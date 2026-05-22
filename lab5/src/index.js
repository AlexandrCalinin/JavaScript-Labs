import {
  addTransaction,
  deleteTransaction,
  findTransaction,
  calculateTotal,
} from "./transactions.js";
import {
  renderTransactionRow,
  removeTransactionRow,
  updateTotal,
  showDetails,
  clearDetails,
} from "./ui.js";

const form = document.getElementById("transaction-form");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const errorEl = document.getElementById("form-error");
const table = document.getElementById("transactions-table");

/**
 * Простая валидация формы.
 * @returns {string|null} текст ошибки или null.
 */
function validateForm() {
  const amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount === 0) {
    return "Сумма должна быть числом и не равна нулю.";
  }
  if (!categoryInput.value) {
    return "Выберите категорию.";
  }
  if (!descriptionInput.value.trim()) {
    return "Введите описание.";
  }
  return null;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = validateForm();
  if (error) {
    errorEl.textContent = error;
    return;
  }
  errorEl.textContent = "";

  const transaction = addTransaction({
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    description: descriptionInput.value.trim(),
  });

  renderTransactionRow(transaction);
  updateTotal(calculateTotal());
  form.reset();
});

table.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    deleteTransaction(id);
    removeTransactionRow(id);
    updateTotal(calculateTotal());
    clearDetails();
    return;
  }

  const row = target.closest("tr");
  if (row && row.parentElement === table.querySelector("tbody")) {
    const t = findTransaction(row.dataset.id);
    if (t) showDetails(t);
  }
});
