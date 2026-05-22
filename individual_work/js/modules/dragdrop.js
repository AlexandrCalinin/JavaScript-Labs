// Перетаскивание карточек книг (HTML5 Drag and Drop)

export function enableDragDrop(container, onDrop) {
    let dragId = null;

    container.addEventListener("dragstart", (e) => {
        const card = e.target.closest("[data-book-id]");
        if (!card) return;
        dragId = card.dataset.bookId;
        card.classList.add("dragging");
    });

    container.addEventListener("dragend", (e) => {
        const card = e.target.closest("[data-book-id]");
        if (card) card.classList.remove("dragging");
        container.querySelectorAll(".drag-over").forEach(el => {
            el.classList.remove("drag-over");
        });
        dragId = null;
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const card = e.target.closest("[data-book-id]");
        if (!card || card.dataset.bookId === dragId) return;
        container.querySelectorAll(".drag-over").forEach(el => {
            el.classList.remove("drag-over");
        });
        card.classList.add("drag-over");
    });

    container.addEventListener("drop", (e) => {
        e.preventDefault();
        const card = e.target.closest("[data-book-id]");
        if (!card || !dragId) return;
        const targetId = card.dataset.bookId;
        if (targetId !== dragId) {
            onDrop(dragId, targetId);
        }
    });
}
