alert("Этот код выполнен из внешнего файла!");
console.log("Сообщение в консоли");

// Задание 2. Работа с типами данных
const name = "Alexandr";
const birthYear = 2004;
const isStudent = true;

console.log("name:", name);
console.log("birthYear:", birthYear);
console.log("isStudent:", isStudent);

// Управление потоком выполнения
let score = prompt("Введите ваш балл:");
if (score >= 90) {
  console.log("Отлично!");
} else if (score >= 70) {
  console.log("Хорошо");
} else {
  console.log("Можно лучше!");
}

for (let i = 1; i <= 5; i++) {
  console.log(`Итерация: ${i}`);
}
