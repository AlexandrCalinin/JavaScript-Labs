// Модальное окно

const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");

export function openModal(node) {
    modalBody.innerHTML = "";
    modalBody.appendChild(node);
    modal.classList.remove("hidden");
}

export function closeModal() {
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
}

export function initModal() {
    // Клик по фону или крестику закрывает окно
    modal.addEventListener("click", (e) => {
        if (e.target.dataset.modalClose !== undefined) {
            closeModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeModal();
        }
    });
}
