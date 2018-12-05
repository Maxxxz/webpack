// 文件类型
// test('null', () => {
//   const n = null;
//   expect(n).toBeNull();
//   expect(n).toBeDefined();
//   expect(n).not.toBeUndefined();
//   expect(n).not.toBeTruthy();
//   expect(n).toBeFalsy();
// });

// test('undefined', () => {
//   const ud = undefined;
//   expect(ud).toBeUndefined();
//   expect(ud).not.toBeDefined();
//   expect(ud).toBeFalsy();
//   expect(ud).toBeNull();
// });

//数字
// test('2+2', () => {
//   const value = 2 + 2;
//   expect(value).toBeGreaterThan(3);
//   expect(value).toBeGreaterThanOrEqual(3.5)
//   expect(value).toBeLessThan(5);
//   expect(value).toBeLessThanOrEqual(4.5);

//   expect(value).toBe(4);
//   expect(value).toEqual(4);
// });

// test('0.1+0.2', () => {
//   const value = 0.1 + 0.2;
//   expect(value).toBeCloseTo(0.3);
// })


//字符串，支持正则
test('isI',()=>{
  expect('teami').toMatch(/I/i);
})

//数组
// const shoppingList = [
//   'bears',
//   'chicken',
//   'apple'
// ]

// test('购物清单',()=>{
//   expect(shoppingList).toContain('bear')
// })

//抛出错误

// function compileAndroidCode() {
//   throw new ConfigError('you are using the wrong JDK');
// }

// test('compiling android goes as expected', () => {
//   // expect(compileAndroidCode).toThrow();
//   expect(compileAndroidCode).toThrow(ConfigError);

//   // You can also use the exact error message or a regexp
//   // expect(compileAndroidCode).toThrow('you are using the wrong JDK');
//   // expect(compileAndroidCode).toThrow(/JDK/);
// });
