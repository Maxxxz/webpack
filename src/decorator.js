class Circle {
  draw() {
    console.log('画一个圈');
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle;
  }
  draw() {
    this.circle.draw();
    this.setRedBorder(this.circle);
  }
  setRedBorder(circle) {
    console.log('设置红色边框');
  }
}

//此处相当于uml的client端
const circle = new Circle();
circle.draw();
const decCircle = new Decorator(circle);
decCircle.draw();

/**
 * 画一个圈
 * 画一个圈
 * 设置红色边框
 */

//mixins
//在原型链上添加方法
function mixins(list) {
  return function(target) {
    Object.assign(target.prototype, list);
  };
}

const Foo = {
  foo() {
    console.log('foo');
  }
};

@mixins(Foo)
class MyClass {
  constructor() {
    this.a = 'a';
  }
  test() {
    console.log(1);
  }
}

const obj = new MyClass();
obj.foo(); //foo

//修饰方法的装饰器
function readonly(target, name, descriptor) {
  descriptor.writable = false;
  return descriptor;
}
class Person {
  constructor() {
    this.firstName = 'max';
    this.lastName = 'zhang';
  }

  @readonly
  name() {
    return `${this.firstName} ${this.lastName}`;
  }
}

const p1 = new Person();
console.log(p1.name());
p1.name = function() {
  console.log(1);
};
console.log('p1', p1);

//打印log
function log(target, name, descriptor) {
  let oldValue = descriptor.value;
  descriptor.value = function() {
    console.log(`calling ${name} with ${arguments}`);
    return oldValue.apply(this, arguments);
  };
}

class Math {
  @log
  add(a, b) {
    return a + b;
  }
}

const mh = new Math();
console.log(mh.add(1, 2));  //
