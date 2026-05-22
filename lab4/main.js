/**
 * Класс, представляющий предмет в инвентаре.
 */
class Item {
  /**
   * @param {string} name - название предмета.
   * @param {number} weight - вес предмета.
   * @param {"common"|"uncommon"|"rare"|"legendary"} rarity - редкость.
   */
  constructor(name, weight, rarity) {
    this.name = name;
    this.weight = weight;
    this.rarity = rarity;
  }

  /**
   * Возвращает строку с информацией о предмете.
   * @returns {string}
   */
  getInfo() {
    return `Item: ${this.name}, weight: ${this.weight}, rarity: ${this.rarity}`;
  }

  /**
   * Меняет вес предмета.
   * @param {number} newWeight
   */
  setWeight(newWeight) {
    this.weight = newWeight;
  }
}

/**
 * Класс оружия, наследуется от Item.
 */
class Weapon extends Item {
  /**
   * @param {string} name
   * @param {number} weight
   * @param {string} rarity
   * @param {number} damage - урон.
   * @param {number} durability - прочность (0..100).
   */
  constructor(name, weight, rarity, damage, durability) {
    super(name, weight, rarity);
    this.damage = damage;
    this.durability = durability;
  }

  /**
   * Использовать оружие — уменьшает прочность на 10.
   */
  use() {
    if (this.durability > 0) {
      this.durability -= 10;
      if (this.durability < 0) this.durability = 0;
    }
  }

  /**
   * Восстановить прочность до 100.
   */
  repair() {
    this.durability = 100;
  }

  /**
   * Расширенная информация для оружия.
   * @returns {string}
   */
  getInfo() {
    return `${super.getInfo()}, damage: ${this.damage}, durability: ${this.durability}`;
  }
}

// ----- Тесты классов -----
console.log("--- Тесты классов ---");
const sword = new Item("Steel Sword", 3.5, "rare");
console.log(sword.getInfo());
sword.setWeight(4.0);
console.log("Новый вес:", sword.weight);

const bow = new Weapon("Longbow", 2.0, "uncommon", 15, 100);
console.log(bow.getInfo());
bow.use();
console.log("Прочность после use():", bow.durability); // 90
bow.use();
console.log("Прочность после use():", bow.durability); // 80
bow.repair();
console.log("Прочность после repair():", bow.durability); // 100

// Опциональная цепочка
const maybeItem = null;
console.log("Опциональная цепочка для null:", maybeItem?.getInfo()); // undefined
console.log("Опциональная цепочка для bow:", bow?.getInfo());

// ----- Функция-конструктор -----
/**
 * Функция-конструктор Item.
 * @param {string} name
 * @param {number} weight
 * @param {string} rarity
 */
function ItemFn(name, weight, rarity) {
  this.name = name;
  this.weight = weight;
  this.rarity = rarity;
}

ItemFn.prototype.getInfo = function () {
  return `Item: ${this.name}, weight: ${this.weight}, rarity: ${this.rarity}`;
};

ItemFn.prototype.setWeight = function (newWeight) {
  this.weight = newWeight;
};

/**
 * Функция-конструктор Weapon, наследуется от ItemFn.
 * @param {string} name
 * @param {number} weight
 * @param {string} rarity
 * @param {number} damage
 * @param {number} durability
 */
function WeaponFn(name, weight, rarity, damage, durability) {
  ItemFn.call(this, name, weight, rarity);
  this.damage = damage;
  this.durability = durability;
}

WeaponFn.prototype = Object.create(ItemFn.prototype);
WeaponFn.prototype.constructor = WeaponFn;

WeaponFn.prototype.use = function () {
  if (this.durability > 0) {
    this.durability -= 10;
    if (this.durability < 0) this.durability = 0;
  }
};

WeaponFn.prototype.repair = function () {
  this.durability = 100;
};

WeaponFn.prototype.getInfo = function () {
  const base = ItemFn.prototype.getInfo.call(this);
  return `${base}, damage: ${this.damage}, durability: ${this.durability}`;
};

console.log("\n--- Тесты функций-конструкторов ---");
const potion = new ItemFn("Health Potion", 0.5, "common");
console.log(potion.getInfo());
potion.setWeight(0.6);
console.log("Новый вес potion:", potion.weight);

const axe = new WeaponFn("Battle Axe", 5.0, "legendary", 30, 100);
console.log(axe.getInfo());
axe.use();
console.log("Прочность axe:", axe.durability);
axe.repair();
console.log("Прочность axe после repair:", axe.durability);
