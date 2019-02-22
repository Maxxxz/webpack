class Product {
  constructor(name) {
    this.name = name;
  }
  init() {
    alert('init');
  }
  fn1() {
    alert('fn1');
  }
  fn2() {
    alert('fn2');
  }
}

class Creator {
  create(name) {
    return new Product(name);
  }
}

let pcreator = new Creator();
let p1 = pcreator.create('p1');
p1.init();
p1.fn2();

class People {
  constructor(name, house) {
    this.name = name;
    this.house = house;
  }

  saySomething() {}
}

class A extends People {
  constructor(name, house) {
    super(name, house);
  }

  saySomething() {
    alert('I am A');
  }
}

class B extends People {
  constructor(name, house) {
    super(name, house);
  }

  saySomething() {
    alert('I am B');
  }
}

class House {
  constructor(city) {
    this.city = city;
  }

  showCity() {
    alert(`this is ${this.city}`);
  }
}

const house = new House('ShenZhen');
const a = new A('maxi', house);
const b = new B('Jaye');

console.log('a,b', a, b);
