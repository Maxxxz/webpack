const {setStorage, getStorage} = require('./../src/cache')

// jest.mock('../src/storage', () => {
//     const data = {};
//     return {
//       get: key => data[key],
//       set: (key, val) => {
//         console.log('key, val', key, val)
//         data[key] = val
//         return val;
//       },
//       remove: key => delete data[key]
//     }
// });
class LocalStorageMock {
    constructor() {
      this.store = {};
    }
  
    clear() {
      this.store = {};
    }
  
    getItem(key) {
      return this.store[key] || null;
    }
  
    setItem(key, value) {
      this.store[key] = String(value);
    }
  
    removeItem(key) {
      delete this.store[key];
    }
};
global.localStorage =  new LocalStorageMock()

// jest.mock('../src/storage',()=>{
//     // moock 函数里不能引用外部作用域声明的函数。
//         console.log('global', global)
//         console.log('mockFN', mockFN)
//       return {}
// });
describe('测试缓存', function(){
    test('set', function(){
        expect(setStorage('num', 3)).toBe(3)
    })

    test('get', function(){
        expect(getStorage('num')).toBe('3')
    })
})