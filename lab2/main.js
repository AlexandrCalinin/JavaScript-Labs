/**
 * Выводит элементы массива в консоль в формате "Element i: value x".
 * @param {Array} array - массив для вывода.
 * @returns {void}
 */
function printArray(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(`Element ${i}: value ${array[i]}`);
  }
}

/**
 * Выводит элементы массива в консоль в формате "i: x".
 * @param {Array} array - массив для вывода.
 * @returns {void}
 */
function printArray1(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(`${i}:  ${array[i]}`);
  }
}

/**
 * Перебирает массив и вызывает колбэк для каждого элемента.
 * @param {Array} array - массив для перебора.
 * @param {Function} callback - функция вида callback(element, index, array).
 * @returns {void}
 */
function forEach(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError("array должен быть массивом");
  }
  if (typeof callback !== "function") {
    throw new TypeError("callback должен быть функцией");
  }
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

/**
 * Создаёт новый массив с результатами вызова колбэка для каждого элемента.
 * @param {Array} array - исходный массив.
 * @param {Function} callback - функция вида callback(element, index, array).
 * @returns {Array} новый массив с результатами.
 */
function map(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

/**
 * Возвращает новый массив, содержащий элементы, для которых колбэк вернул true.
 * @param {Array} array - исходный массив.
 * @param {Function} callback - функция вида callback(element, index, array).
 * @returns {Array} отфильтрованный массив.
 */
function filter(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

/**
 * Возвращает первый элемент, для которого колбэк вернул true.
 * @param {Array} array - исходный массив.
 * @param {Function} callback - функция вида callback(element, index, array).
 * @returns {*} найденный элемент или undefined.
 */
function find(array, callback) {
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Проверяет, есть ли хотя бы один элемент, удовлетворяющий условию колбэка.
 * @param {Array} array - исходный массив.
 * @param {Function} callback - функция вида callback(element, index, array).
 * @returns {boolean} true, если хотя бы один элемент подходит.
 */
function some(array, callback) {
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      return true;
    }
  }
  return false;
}

/**
 * Проверяет, удовлетворяют ли все элементы массива условию колбэка.
 * @param {Array} array - исходный массив.
 * @param {Function} callback - функция вида callback(element, index, array).
 * @returns {boolean} true, если все элементы подходят.
 */
function every(array, callback) {
  for (let i = 0; i < array.length; i++) {
    if (!callback(array[i], i, array)) {
      return false;
    }
  }
  return true;
}

/**
 * Сворачивает массив к одному значению, последовательно применяя колбэк.
 * @param {Array} array - исходный массив.
 * @param {Function} callback - функция вида callback(accumulator, element, index, array).
 * @param {*} [initialValue] - начальное значение аккумулятора (необязательно).
 * @returns {*} итоговое значение аккумулятора.
 */
function reduce(array, callback, initialValue) {
  let accumulator;
  let startIndex;

  if (arguments.length >= 3) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    if (array.length === 0) {
      return undefined;
    }
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }
  return accumulator;
}

// ----- Тесты -----
console.log("--- printArray ---");
printArray(["a", "b", "c"]);

console.log("--- printArray1 ---");
printArray1(["a", "b", "c"]);

console.log("--- forEach ---");
forEach([1, 2, 3], (element, index) => {
  console.log(`Element: ${element}, Index: ${index}`);
});

console.log("--- map ---");
console.log(map([1, 2, 3], (x) => x * x)); // [1, 4, 9]

console.log("--- filter ---");
console.log(filter([1, 2, 3, 4, 5], (x) => x % 2 === 0)); // [2, 4]

console.log("--- find ---");
console.log(find([1, 2, 3, 4, 5], (x) => x % 2 === 0)); // 2

console.log("--- some ---");
console.log(some([1, 2, 3, 4, 5], (x) => x % 2 === 0)); // true

console.log("--- every ---");
console.log(every([2, 4, 6], (x) => x % 2 === 0)); // true
console.log(every([1, 2, 3], (x) => x % 2 === 0)); // false

console.log("--- reduce ---");
console.log(reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 0)); // 15
console.log(reduce([1, 2, 3], (acc, x) => acc + x)); // 6 (без initialValue)
console.log(reduce([], (acc, x) => acc + x)); // undefined
