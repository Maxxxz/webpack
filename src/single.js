class SingleObject {
  login() {
    console.log('login...');
  }
}

//通过闭包和挂载构造函数上面的属性方法去处理只实例化一次
SingleObject.getInstance = (function() {
  let instance = null;
  return function() {
    if (!instance) {
      instance = new SingleObject();
    }
    return instance;
  };
})();

//此处初始化只能用getInstance
//如果直接用new也能初始化，但是这样两次比较就不一致
//这种只能通过文档去规范
let obj1 = SingleObject.getInstance();
obj1.login();
let obj2 = SingleObject.getInstance();
obj2.login();

console.log('obj1 obj2', obj1 === obj2);  //true

//js无法完全控制
//通过模块化可以处理
let obj3 = new SingleObject();
console.log('obj1 obj3', obj1 === obj3);  //false
