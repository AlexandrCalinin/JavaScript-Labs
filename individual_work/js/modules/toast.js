// Всплывающие уведомления в углу

const host = document.getElementById("toast-host");

export function showToast(message, type) {
    type = type || "info";
    const div = document.createElement("div");
    div.className = "toast toast-" + type;
    div.textContent = message;
    host.appendChild(div);

    // Убираем через 3 секунды
    setTimeout(() => {
        div.classList.add("toast-out");
        setTimeout(() => div.remove(), 300);
    }, 2800);
}
