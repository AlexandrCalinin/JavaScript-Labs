// Переключение вкладок

export function initTabs(onChange) {
    const buttons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");

    function activate(name) {
        buttons.forEach(b => {
            b.classList.toggle("is-active", b.dataset.tab === name);
        });
        panels.forEach(p => {
            p.classList.toggle("is-active", p.id === "tab-" + name);
        });
        if (onChange) onChange(name);
    }

    buttons.forEach(b => {
        b.addEventListener("click", () => activate(b.dataset.tab));
    });

    return { activate };
}
