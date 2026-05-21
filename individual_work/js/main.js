// Точка входа приложения. Здесь связываем все модули вместе.

import * as library from "./modules/library.js";
import { loadTheme, saveTheme } from "./modules/storage.js";
import { validateBook } from "./modules/validation.js";
import {
    renderBookList,
    createBookDetails,
    updateGenreFilter,
    renderStats,
    createApiResultItem
} from "./modules/ui.js";
import { initTabs } from "./modules/tabs.js";
import { initModal, openModal } from "./modules/modal.js";
import { enableDragDrop } from "./modules/dragdrop.js";
import { searchBooks } from "./modules/api.js";
import { showToast } from "./modules/toast.js";

// Получаем все нужные элементы со страницы
const $ = (id) => document.getElementById(id);

const listEl = $("book-list");
const counterEl = $("book-counter");
const emptyEl = $("empty-state");
const searchEl = $("search-input");
const filterGenreEl = $("filter-genre");
const filterStatusEl = $("filter-status");
const sortByEl = $("sort-by");
const resetFiltersEl = $("reset-filters");

const formEl = $("book-form");
const formIdEl = $("book-id");
const submitBtn = $("form-submit");

const apiFormEl = $("api-search-form");
const apiQueryEl = $("api-query");
const apiStatusEl = $("api-status");
const apiResultsEl = $("api-results");

const themeBtn = $("theme-toggle");

const statsElements = {
    total: $("stat-total"),
    done: $("stat-done"),
    reading: $("stat-reading"),
    want: $("stat-want"),
    avg: $("stat-avg"),
    chart: $("genre-chart")
};

// Текущее состояние фильтров
let filters = {
    search: "",
    genre: "",
    status: "",
    sort: "custom"
};

// Перерисовать список книг
function refreshList() {
    const books = library.query(filters);
    renderBookList(listEl, books, {
        onOpen: handleOpen,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onStatusToggle: handleStatusToggle
    });

    const total = library.getAll().length;
    counterEl.textContent = "Книг в библиотеке: " + total + " · показано: " + books.length;
    emptyEl.classList.toggle("hidden", total !== 0);

    updateGenreFilter(filterGenreEl, library.getGenres());
}

function refreshStats() {
    renderStats(statsElements, library.getStats());
}

// --- Обработчики действий с книгой ---

function handleOpen(id) {
    const book = library.getById(id);
    if (book) openModal(createBookDetails(book));
}

function handleEdit(id) {
    const book = library.getById(id);
    if (!book) return;
    tabs.activate("add");
    fillForm(book);
}

function handleDelete(id) {
    const book = library.getById(id);
    if (!book) return;
    if (confirm("Удалить «" + book.title + "»?")) {
        library.deleteBook(id);
        showToast("Книга удалена", "success");
    }
}

function handleStatusToggle(id) {
    const book = library.getById(id);
    if (!book) return;
    const next = book.status === "done" ? "want" : "done";
    library.updateBook(id, { status: next });
    showToast("Статус изменён", "success");
}

// --- Работа с формой ---

// Считать значения из формы
function readForm() {
    return {
        title: $("f-title").value.trim(),
        author: $("f-author").value.trim(),
        year: Number($("f-year").value),
        genre: $("f-genre").value.trim(),
        rating: Number($("f-rating").value),
        status: $("f-status").value,
        cover: $("f-cover").value.trim(),
        note: $("f-note").value.trim()
    };
}

// Заполнить форму для редактирования
function fillForm(book) {
    formIdEl.value = book.id;
    $("f-title").value = book.title;
    $("f-author").value = book.author;
    $("f-year").value = book.year;
    $("f-genre").value = book.genre;
    $("f-rating").value = book.rating;
    $("f-status").value = book.status;
    $("f-cover").value = book.cover || "";
    $("f-note").value = book.note || "";
    submitBtn.textContent = "Сохранить изменения";
    clearErrors();
}

function clearErrors() {
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    document.querySelectorAll(".input.is-invalid").forEach(el => el.classList.remove("is-invalid"));
}

function showFieldError(fieldId, message) {
    const input = $(fieldId);
    const err = document.querySelector('.field-error[data-for="' + fieldId + '"]');
    if (!input || !err) return;
    input.classList.add("is-invalid");
    err.textContent = message;
}

function resetForm() {
    formEl.reset();
    formIdEl.value = "";
    submitBtn.textContent = "Сохранить";
    clearErrors();
}

// Связь имени поля с id input'а
const fieldToInputId = {
    title: "f-title",
    author: "f-author",
    year: "f-year",
    genre: "f-genre",
    rating: "f-rating",
    cover: "f-cover"
};

function handleSubmit(e) {
    e.preventDefault();
    clearErrors();

    const data = readForm();
    const errors = validateBook(data);

    if (Object.keys(errors).length > 0) {
        for (const field in errors) {
            showFieldError(fieldToInputId[field], errors[field]);
        }
        showToast("Проверьте заполненные поля", "error");
        return;
    }

    if (formIdEl.value) {
        library.updateBook(formIdEl.value, data);
        showToast("Книга обновлена", "success");
    } else {
        library.addBook(data);
        showToast("Книга добавлена!", "success");
    }

    resetForm();
    tabs.activate("library");
}

// --- Сброс фильтров ---

function resetFilters() {
    filters = { search: "", genre: "", status: "", sort: "custom" };
    searchEl.value = "";
    filterGenreEl.value = "";
    filterStatusEl.value = "";
    sortByEl.value = "custom";
    refreshList();
}

// --- Поиск через внешнее API ---

async function handleApiSearch(e) {
    e.preventDefault();
    const query = apiQueryEl.value.trim();
    if (!query) return;

    apiResultsEl.innerHTML = "";
    apiStatusEl.textContent = "Ищем книги...";

    try {
        const items = await searchBooks(query);
        if (items.length === 0) {
            apiStatusEl.textContent = "Ничего не найдено";
            return;
        }
        apiStatusEl.textContent = "Найдено: " + items.length;
        items.forEach(item => {
            apiResultsEl.appendChild(createApiResultItem(item, importFromApi));
        });
    } catch (err) {
        console.log("Ошибка поиска:", err);
        apiStatusEl.textContent = "Ошибка запроса. Попробуйте ещё раз.";
        showToast("Не удалось загрузить данные", "error");
    }
}

function importFromApi(item, button) {
    const book = {
        title: item.title,
        author: item.author,
        year: item.year || new Date().getFullYear(),
        genre: item.genre || "Прочее",
        rating: 3,
        status: "want",
        cover: item.cover,
        note: "Добавлено через Open Library"
    };

    const errors = validateBook(book);
    if (Object.keys(errors).length > 0) {
        showToast("Не удалось добавить — ошибки в данных", "error");
        return;
    }

    library.addBook(book);
    button.textContent = "✓ Добавлено";
    button.disabled = true;
    showToast("«" + book.title + "» добавлена", "success");
}

// --- Тема (светлая / тёмная) ---

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeBtn.querySelector(".theme-icon").textContent = theme === "dark" ? "☀" : "🌙";
}

function initTheme() {
    applyTheme(loadTheme());
    themeBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        saveTheme(next);
    });
}

// --- Инициализация вкладок ---

const tabs = initTabs((name) => {
    if (name === "stats") refreshStats();
    if (name !== "add") resetForm();
});

// --- Подключаем все обработчики ---

searchEl.addEventListener("input", (e) => {
    filters.search = e.target.value;
    refreshList();
});

filterGenreEl.addEventListener("change", (e) => {
    filters.genre = e.target.value;
    refreshList();
});

filterStatusEl.addEventListener("change", (e) => {
    filters.status = e.target.value;
    refreshList();
});

sortByEl.addEventListener("change", (e) => {
    filters.sort = e.target.value;
    refreshList();
});

resetFiltersEl.addEventListener("click", resetFilters);
formEl.addEventListener("submit", handleSubmit);
$("form-reset").addEventListener("click", () => setTimeout(resetForm, 0));
apiFormEl.addEventListener("submit", handleApiSearch);

// Когда библиотека меняется — перерисовываем
library.onChange(() => {
    refreshList();
    // если открыта вкладка статистики — обновляем и её
    if ($("tab-stats").classList.contains("is-active")) {
        refreshStats();
    }
});

// Drag and drop карточек
enableDragDrop(listEl, (fromId, toId) => {
    if (filters.sort !== "custom") {
        showToast("Сортировка вручную возможна только в режиме «Вручную»", "error");
        return;
    }
    library.reorder(fromId, toId);
});

// Запускаем приложение
initTheme();
initModal();
refreshList();
refreshStats();
