// class RealImg {
//   constructor(fileName) {
//     this.fileName = fileName;
//     this.loadFromDisk();
//   }

//   loadFromDisk() {
//     console.log('this.loading... ' + this.fileName);
//   }

//   display() {
//     console.log(`show img ${this.fileName}`);
//   }
// }

// class ProxyImg {
//   constructor(fileName) {
//     this.realImg = new RealImg(fileName);
//   }
//   display() {
//     this.realImg.display();
//   }
// }

// const img = new ProxyImg('xx');
// img.display();

let star = {
  name: 'maxi',
  age: 27,
  phone: 132000000
};

//注意，代理的接口要和上面的接口一样。
let agent = new Proxy(star, {
  get(target, key) {
    if (key === 'phone') {
      return 13512300000;
    } else if (key === 'price') {
      return 170000;
    } else {
      return target[key];
    }
  },
  set(target, key, val) {
    if (key === 'customPrice') {
      if (val < 100000) {
        throw new Error('价格太低');
      } else {
        target[key] = val;
        return true;
      }
    }
  }
});

console.log(agent.name); //maxi
console.log(agent.age); //27
console.log(agent.phone); //agent
console.log(agent.price); //170000
// agent.customPrice = 80000;
agent.customPrice = 130000;
console.log(agent.customPrice);
