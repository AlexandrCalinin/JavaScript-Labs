// Поиск книг через открытое API Open Library
// https://openlibrary.org/dev/docs/api/search

const URL_BASE = "https://openlibrary.org/search.json";

export async function searchBooks(query) {
    const url = URL_BASE + "?q=" + encodeURIComponent(query) + "&limit=12";
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ошибка запроса: " + response.status);
    }

    const data = await response.json();
    const docs = data.docs || [];

    // Преобразуем формат API в нужный нам
    return docs.map(d => ({
        title: d.title || "Без названия",
        author: (d.author_name && d.author_name[0]) || "Неизвестный автор",
        year: d.first_publish_year || null,
        cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : "",
        genre: (d.subject && d.subject[0]) || ""
    }));
}
