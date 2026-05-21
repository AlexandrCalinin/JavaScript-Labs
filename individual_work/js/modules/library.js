// Модуль для работы с библиотекой книг
// Хранит массив книг и методы для работы с ним

import { loadBooks, saveBooks } from "./storage.js";
import { seedBooks } from "../data/books.js";

let books = loadBooks() || JSON.parse(JSON.stringify(seedBooks));
let listeners = [];

function notify() {
    saveBooks(books);
    listeners.forEach(fn => fn());
}

// Создаём уникальный id
function makeId() {
    return "b" + Date.now() + Math.floor(Math.random() * 1000);
}

export function onChange(fn) {
    listeners.push(fn);
}

export function getAll() {
    return books.slice();
}

export function getById(id) {
    return books.find(b => b.id === id) || null;
}

export function addBook(data) {
    const book = Object.assign({ id: makeId() }, data);
    books.push(book);
    notify();
    return book;
}

export function updateBook(id, data) {
    const i = books.findIndex(b => b.id === id);
    if (i === -1) return null;
    books[i] = Object.assign({}, books[i], data, { id: id });
    notify();
    return books[i];
}

export function deleteBook(id) {
    books = books.filter(b => b.id !== id);
    notify();
}

// Перетаскивание — меняем порядок книг в массиве
export function reorder(fromId, toId) {
    const from = books.findIndex(b => b.id === fromId);
    const to = books.findIndex(b => b.id === toId);
    if (from === -1 || to === -1 || from === to) return;
    const moved = books.splice(from, 1)[0];
    books.splice(to, 0, moved);
    notify();
}

// Получить список уникальных жанров (для фильтра)
export function getGenres() {
    const set = new Set();
    books.forEach(b => {
        if (b.genre) set.add(b.genre);
    });
    return Array.from(set).sort();
}

// Фильтрация, поиск и сортировка
export function query(opts) {
    const { search = "", genre = "", status = "", sort = "custom" } = opts || {};
    const q = search.trim().toLowerCase();

    let result = books.filter(b => {
        if (genre && b.genre !== genre) return false;
        if (status && b.status !== status) return false;
        if (q) {
            const text = (b.title + " " + b.author).toLowerCase();
            if (!text.includes(q)) return false;
        }
        return true;
    });

    if (sort === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "author") {
        result.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sort === "year-asc") {
        result.sort((a, b) => a.year - b.year);
    } else if (sort === "year-desc") {
        result.sort((a, b) => b.year - a.year);
    } else if (sort === "rating-desc") {
        result.sort((a, b) => b.rating - a.rating);
    }

    return result;
}

// Подсчёт статистики
export function getStats() {
    let done = 0, reading = 0, want = 0, sumRating = 0;
    const byGenre = {};

    for (const b of books) {
        if (b.status === "done") done++;
        if (b.status === "reading") reading++;
        if (b.status === "want") want++;
        sumRating += b.rating;
        byGenre[b.genre] = (byGenre[b.genre] || 0) + 1;
    }

    const avg = books.length > 0 ? (sumRating / books.length).toFixed(2) : "—";

    return {
        total: books.length,
        done: done,
        reading: reading,
        want: want,
        avg: avg,
        byGenre: byGenre
    };
}
