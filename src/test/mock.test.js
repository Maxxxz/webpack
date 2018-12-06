
// https://jestjs.io/docs/zh-Hans/mock-functions
import axios from 'axios';

function drinkAll(fn, name) {
  if (name === "lemon") {
    fn(name);
  }
}

class Users {
  static all() {
    return axios.get('/users.json').then(resp => resp.data);
  }
}

jest.mock('axios');

test.only('should fetch users', () => {
  const resp = {data: [{name: 'Bob'}]};
  axios.get.mockResolvedValue(resp);    //伪造一个get返回值
   // axios.get.mockImplementation(() => Promise.resolve(resp)) 上面的语句是个语法糖，实际是
  expect.assertions(1);
  console.log('resp', resp)

  return Users.all().then(users => expect(users).toEqual(resp.data));
});

// function drinkEach(fn, arr) {
//   arr.forEach(v => fn(v));
// }

test("被调用", () => {
  const mockFn = jest.fn(o => o + 5);
  drinkAll(mockFn, "lemon");

  expect(mockFn.mock.calls).toEqual([["lemon"]]);
});


function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

test('fn', () => {
  const mockCallback = jest.fn(x => 42 + x);
  console.log('mockCallback1', mockCallback.mock);
  forEach([0, 1], mockCallback);
  console.log('mockCallback2', mockCallback.mock);

  // The mock function is called twice
  expect(mockCallback.mock.calls.length).toBe(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
})
