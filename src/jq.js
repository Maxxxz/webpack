class JQuery {
  constructor(selecter) {
    const slice = Array.prototype.slice;
    const dom = slice.call(document.querySelectorAll(selecter));
    const len = dom ? dom.length : 0;
    for (let i = 0; i < len; i++) {
      this[i] = dom[i];
    }
    this.length = len;
    this.selecter = selecter || null;
  }

  append() {
    //...
    return this;
  }
}

window.$ = function(selecter) { 
  //这种将new操作封装到函数中的，就是工厂模式。
  // 或者说函数返回一个实例
  return new JQuery(selecter);
};
