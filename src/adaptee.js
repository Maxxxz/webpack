//适配器模式

class Adaptee {
  specificRequest() {
    return '标准1';
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptee();
  }

  request() {
    let info = this.adaptee.specificRequest();
    return `${info} -- 转换器 -- 标准2`;
  }
}

let t1 = new Target();
console.log(t1.request()); //标准1 -- 转换器 -- 标准2
