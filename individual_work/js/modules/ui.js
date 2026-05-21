// Функции для отрисовки интерфейса

const statusLabels = {
    want: "Хочу прочесть",
    reading: "Читаю",
    done: "Прочитано"
};

// Рисует звёзды рейтинга
function stars(n) {
    let s = "";
    for (let i = 0; i < 5; i++) {
        s += i < n ? "★" : "☆";
    }
    return s;
}

// Создаёт карточку книги
export function createBookCard(book, handlers) {
    const li = document.createElement("li");
    li.className = "book-card";
    li.dataset.bookId = book.id;
    li.draggable = true;

    // Обложка (или заглушка, если нет ссылки)
    let coverHtml;
    if (book.cover) {
        coverHtml = `<img class="book-cover" src="${book.cover}" alt="Обложка" loading="lazy">`;
    } else {
        const letter = book.title.charAt(0).toUpperCase();
        coverHtml = `<div class="book-cover-fallback">${letter}</div>`;
    }

    li.innerHTML = `
        ${coverHtml}
        <h3 class="book-title"></h3>
        <p class="book-author"></p>
        <div class="book-rating" title="Рейтинг: ${book.rating}/5">${stars(book.rating)}</div>
        <div class="book-meta">
            <span class="badge"></span>
            <span class="badge">${book.year}</span>
            <span class="badge badge-status-${book.status}">${statusLabels[book.status]}</span>
        </div>
        <div class="book-actions">
            <button class="btn btn-ghost btn-sm" data-action="open">Открыть</button>
            <button class="btn btn-ghost btn-sm" data-action="edit">Изменить</button>
            <button class="btn btn-ghost btn-sm" data-action="status">
                ${book.status === "done" ? "↩ В планы" : "✓ Прочёл"}
            </button>
            <button class="btn btn-danger btn-sm" data-action="delete">Удалить</button>
        </div>
    `;

    // Безопасно вставляем пользовательский текст (защита от XSS)
    li.querySelector(".book-title").textContent = book.title;
    li.querySelector(".book-author").textContent = book.author;
    li.querySelector(".book-meta .badge").textContent = book.genre;

    // Если картинка не загрузилась — показываем заглушку
    const img = li.querySelector(".book-cover");
    if (img) {
        img.addEventListener("error", () => {
            const fb = document.createElement("div");
            fb.className = "book-cover-fallback";
            fb.textContent = book.title.charAt(0).toUpperCase();
            img.replaceWith(fb);
        });
    }

    // Делегирование событий — один слушатель на все кнопки
    li.querySelector(".book-actions").addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        if (action === "open") handlers.onOpen(book.id);
        else if (action === "edit") handlers.onEdit(book.id);
        else if (action === "delete") handlers.onDelete(book.id);
        else if (action === "status") handlers.onStatusToggle(book.id);
    });

    return li;
}

export function renderBookList(listEl, books, handlers) {
    listEl.innerHTML = "";
    books.forEach(b => listEl.appendChild(createBookCard(b, handlers)));
}

// Содержимое модального окна
export function createBookDetails(book) {
    const div = document.createElement("div");

    const title = document.createElement("h2");
    title.style.marginTop = "0";
    title.textContent = book.title;

    const author = document.createElement("p");
    author.style.color = "var(--text-muted)";
    author.style.fontStyle = "italic";
    author.textContent = book.author + ", " + book.year;

    div.appendChild(title);
    div.appendChild(author);

    if (book.cover) {
        const img = document.createElement("img");
        img.className = "modal-body-cover";
        img.src = book.cover;
        img.alt = "Обложка";
        img.addEventListener("error", () => img.remove());
        div.appendChild(img);
    }

    const meta = document.createElement("p");
    meta.innerHTML = `
        <span class="badge"></span>
        <span class="badge badge-status-${book.status}">${statusLabels[book.status]}</span>
        <span class="book-rating" style="margin-left: 0.5rem">${stars(book.rating)}</span>
    `;
    meta.querySelector(".badge").textContent = book.genre;
    div.appendChild(meta);

    const note = document.createElement("p");
    note.style.marginTop = "1rem";
    note.style.whiteSpace = "pre-wrap";
    if (book.note) {
        note.textContent = book.note;
    } else {
        note.style.color = "var(--text-muted)";
        note.textContent = "Заметок нет.";
    }
    div.appendChild(note);

    return div;
}

// Обновление списка жанров в фильтре
export function updateGenreFilter(selectEl, genres) {
    const previous = selectEl.value;
    selectEl.innerHTML = '<option value="">Все жанры</option>';
    genres.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g;
        opt.textContent = g;
        selectEl.appendChild(opt);
    });
    if (genres.includes(previous)) selectEl.value = previous;
}

// Отрисовка статистики
export function renderStats(elements, stats) {
    elements.total.textContent = stats.total;
    elements.done.textContent = stats.done;
    elements.reading.textContent = stats.reading;
    elements.want.textContent = stats.want;
    elements.avg.textContent = stats.avg;

    const chart = elements.chart;
    chart.innerHTML = "";

    const entries = Object.entries(stats.byGenre).sort((a, b) => b[1] - a[1]);
    if (entries.length === 0) {
        chart.innerHTML = '<p style="color: var(--text-muted)">Нет данных</p>';
        return;
    }

    const max = Math.max(...entries.map(e => e[1]));
    entries.forEach(([genre, count]) => {
        const row = document.createElement("div");
        row.className = "chart-row";
        const percent = (count / max) * 100;
        row.innerHTML = `
            <span class="chart-label"></span>
            <span class="chart-bar"><span class="chart-bar-fill" style="width: ${percent}%"></span></span>
            <span>${count}</span>
        `;
        row.querySelector(".chart-label").textContent = genre;
        chart.appendChild(row);
    });
}

// Карточка результата поиска через API
export function createApiResultItem(item, onImport) {
    const li = document.createElement("li");
    li.className = "api-result-item";

    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    if (item.cover) img.src = item.cover;

    const info = document.createElement("div");
    info.className = "api-result-info";
    const strong = document.createElement("strong");
    strong.textContent = item.title;
    const span = document.createElement("span");
    span.textContent = item.author + (item.year ? ", " + item.year : "");
    info.appendChild(strong);
    info.appendChild(span);

    const btn = document.createElement("button");
    btn.className = "btn btn-primary btn-sm";
    btn.textContent = "Добавить";
    btn.addEventListener("click", () => onImport(item, btn));

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(btn);
    return li;
}
