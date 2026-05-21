// Валидация полей формы. Каждая функция возвращает сообщение об ошибке или null.

const thisYear = new Date().getFullYear();

export function validateTitle(value) {
    if (!value || value.trim().length === 0) return "Введите название";
    if (value.length > 120) return "Слишком длинное название";
    return null;
}

export function validateAuthor(value) {
    if (!value || value.trim().length === 0) return "Введите автора";
    if (value.length > 80) return "Слишком длинное имя автора";
    return null;
}

export function validateYear(value) {
    const n = Number(value);
    if (!Number.isInteger(n)) return "Год должен быть целым числом";
    if (n < 1 || n > thisYear + 1) return "Введите корректный год";
    return null;
}

export function validateGenre(value) {
    if (!value || value.trim().length === 0) return "Укажите жанр";
    return null;
}

export function validateRating(value) {
    const n = Number(value);
    if (!Number.isInteger(n)) return "Рейтинг — целое число";
    if (n < 1 || n > 5) return "Рейтинг от 1 до 5";
    return null;
}

export function validateCover(value) {
    if (!value) return null; // поле необязательное
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
        return "Ссылка должна начинаться с http:// или https://";
    }
    return null;
}

// Проверяет всю книгу и возвращает объект с ошибками (или {} если всё ок)
export function validateBook(book) {
    const errors = {};
    const title = validateTitle(book.title);
    if (title) errors.title = title;
    const author = validateAuthor(book.author);
    if (author) errors.author = author;
    const year = validateYear(book.year);
    if (year) errors.year = year;
    const genre = validateGenre(book.genre);
    if (genre) errors.genre = genre;
    const rating = validateRating(book.rating);
    if (rating) errors.rating = rating;
    const cover = validateCover(book.cover);
    if (cover) errors.cover = cover;
    return errors;
}
