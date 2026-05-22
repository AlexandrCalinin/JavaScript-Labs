# Лабораторная работа №3. Анализ транзакций

## Автор
Калинин Александр

## Инструкции по запуску

1. Установите [Node.js](https://nodejs.org/).
2. Откройте терминал в папке `lab3`.
3. Выполните:

```bash
node main.js
```

Все функции уже вызываются в конце файла на тестовом массиве транзакций.

## Описание лабораторной работы

Цель — изучить работу с массивами объектов и функциями в JavaScript. Реализовано консольное приложение, которое анализирует список транзакций: считает суммы, фильтрует по дате/типу/мерчанту, ищет конкретную транзакцию и т.д.

Каждая транзакция содержит поля: `transaction_id`, `transaction_date`, `transaction_amount`, `transaction_type`, `transaction_description`, `merchant_name`, `card_type`.

## Краткая документация

Все функции находятся в `main.js`:

| Функция | Описание |
| --- | --- |
| `getUniqueTransactionTypes(transactions)` | Уникальные типы транзакций (через `Set`). |
| `calculateTotalAmount(transactions)` | Сумма всех транзакций. |
| `calculateTotalAmountByDate(transactions, year?, month?, day?)` | Сумма за указанный год/месяц/день (любой параметр можно опустить). |
| `getTransactionByType(transactions, type)` | Транзакции указанного типа (`debit` / `credit`). |
| `getTransactionsInDateRange(transactions, startDate, endDate)` | Транзакции в диапазоне дат. |
| `getTransactionsByMerchant(transactions, merchantName)` | Транзакции по имени мерчанта. |
| `calculateAverageTransactionAmount(transactions)` | Среднее значение. |
| `getTransactionsByAmountRange(transactions, min, max)` | Транзакции в диапазоне сумм. |
| `calculateTotalDebitAmount(transactions)` | Сумма дебетовых транзакций. |
| `findMostTransactionsMonth(transactions)` | Месяц с максимальным числом транзакций. |
| `findMostDebitTransactionMonth(transactions)` | Месяц с максимальным числом дебетовых. |
| `mostTransactionTypes(transactions)` | `"debit"`, `"credit"` или `"equal"`. |
| `getTransactionsBeforeDate(transactions, date)` | Транзакции до указанной даты. |
| `findTransactionById(transactions, id)` | Поиск по id. |
| `mapTransactionDescriptions(transactions)` | Массив только описаний. |

Документация к каждой функции оформлена в стиле JSDoc.

## Примеры использования

```javascript
getUniqueTransactionTypes(transactions);
// [ 'debit', 'credit' ]

calculateTotalAmount(transactions);
// 2290.5

calculateTotalAmountByDate(transactions, 2024, 2);
// 1875

mostTransactionTypes(transactions);
// 'debit'

findTransactionById(transactions, "3");
// { transaction_id: '3', ... }
```

### Проверка граничных случаев

```
Пустой массив, сумма: 0
Пустой массив, среднее: 0
Пустой массив, mostTransactionTypes: equal
Один элемент, сумма: 120.5
```

## Ответы на контрольные вопросы

**1. Какие методы массивов можно использовать для обработки объектов в JavaScript?**

Чаще всего применяются:
- `forEach` — перебор без возврата нового массива;
- `map` — преобразование каждого объекта;
- `filter` — отбор по условию;
- `find` / `findIndex` — поиск конкретного объекта;
- `some` / `every` — логические проверки;
- `reduce` — агрегация (сумма, группировка, поиск максимума);
- `sort` — сортировка по полю объекта.

**2. Как сравнивать даты в строковом формате в JavaScript?**

- Если строка в формате ISO (`YYYY-MM-DD`), её можно сравнивать напрямую как строки — лексикографический порядок совпадает с хронологическим.
- Более универсальный способ — преобразовать строки в `Date` (`new Date(str)`) и сравнивать через операторы `<`, `>`, `<=`, `>=`. Для проверки на равенство удобно сравнивать `getTime()`.

**3. В чём разница между `map()`, `filter()` и `reduce()` при работе с массивами объектов?**

- `map` возвращает новый массив той же длины, преобразуя каждый объект (например, в строку или новое поле).
- `filter` возвращает новый массив, оставляя только объекты, удовлетворяющие условию; длина обычно меньше или равна исходной.
- `reduce` сворачивает массив в одно значение (число, объект, массив), накапливая результат через колбэк. Используется для агрегаций.

## Источники

- MDN Web Docs — Array (https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array)
- MDN Web Docs — Date (https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date)
- Learn JavaScript — Методы массивов (https://learn.javascript.ru/array-methods)
