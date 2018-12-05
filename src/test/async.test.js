
//https://jestjs.io/docs/zh-Hans/asynchronous

//回调的形式
// function fetchData(cb){
//   setTimeout(()=>{
//     cb('peanut butter');
//   },10)
// }

// test('the data is peanut butter', (done) => { //必须用上形参，不然不会去检测异步
//   function callback(data) {
//     console.log('data', data)
//     expect(data).toBe('peanut butter');
//     // done();   //不给的话默认5S超时。
//   }
//   fetchData(callback);
// });


//promise的形式
function PromiseFetch (){
  return Promise.resolve('1');
}

function PromiseReject(){
  return Promise.reject('1');
}
// test('promise',()=>{
//   // expect.assertions(1)  //断言的数量，用在连续promise上吧
//   return PromiseFetch().then((res)=>{
//     expect(res).toBe('1')
//     // expect(res).toBe(1)   //英文和中文不一致
//   })
// })

//async await
test('the data is peanut butter', async () => {
  expect.assertions(1);
  const data = await PromiseFetch();
  expect(data).toBe('1');
});

test('the fetch fails with an error', async () => {
  expect.assertions(1);
  try {
    await PromiseReject();
  } catch (e) {
    expect(e).toMatch('error');
  }
});
