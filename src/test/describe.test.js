
function promise_resolve() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("resolve"), 200);
 });
}

function promise_reject() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("reject"), 200);
 });
}

//async await
test.skip("不写 then ，只写 catch", () => {
  // expect.assertions(1);
  return promise_resolve().catch(data => {
    console.log("调用断言");
    expect(1).toBe(1);
 });
});

