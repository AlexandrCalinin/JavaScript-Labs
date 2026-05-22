import { formatDate, shortDescription } from "./utils.js";

const tableBody = document.querySelector("#transactions-table tbody");
const totalEl = document.getElementById("total");
const detailsEl = document.getElementById("details");

/**
 * Добавляет новую строку в таблицу для транзакции.
 * @param {{id: string, date: Date, amount: number, category: string, description: string}} t
 */
export function renderTransactionRow(t) {
  const row = document.createElement("tr");
  row.dataset.id = t.id;
  row.classList.add(t.amount >= 0 ? "positive" : "negative");

  row.innerHTML = `
    <td>${formatDate(t.date)}</td>
    <td>${t.category}</td>
    <td>${shortDescription(t.description)}</td>
    <td><button class="delete-btn" data-id="${t.id}">Удалить</button></td>
  `;
  tableBody.appendChild(row);
}

/**
 * Удаляет строку таблицы по id транзакции.
 * @param {string} id
 */
export function removeTransactionRow(id) {
  const row = tableBody.querySelector(`tr[data-id="${id}"]`);
  if (row) row.remove();
}

/**
 * Обновляет блок с общей суммой.
 * @param {number} total
 */
export function updateTotal(total) {
  totalEl.textContent = total.toFixed(2);
}

/**
 * Отображает подробную информацию о транзакции в блоке details.
 * @param {{id: string, date: Date, amount: number, category: string, description: string}} t
 */
export function showDetails(t) {
  detailsEl.innerHTML = `
    <p><b>ID:</b> ${t.id}</p>
    <p><b>Дата:</b> ${formatDate(t.date)}</p>
    <p><b>Категория:</b> ${t.category}</p>
    <p><b>Сумма:</b> ${t.amount}</p>
    <p><b>Описание:</b> ${t.description}</p>
  `;
}

/**
 * Очищает блок details (например, после удаления показываемой транзакции).
 */
export function clearDetails() {
  detailsEl.textContent = "Кликните по строке таблицы, чтобы увидеть полное описание.";
}
