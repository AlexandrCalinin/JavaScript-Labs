// Сохранение данных в localStorage

const KEY = "myshelf_books";
const THEME = "myshelf_theme";

export function loadBooks() {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.log("Ошибка чтения из localStorage", e);
        return null;
    }
}

export function saveBooks(books) {
    localStorage.setItem(KEY, JSON.stringify(books));
}

export function loadTheme() {
    return localStorage.getItem(THEME) || "light";
}

export function saveTheme(theme) {
    localStorage.setItem(THEME, theme);
}
