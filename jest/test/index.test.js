// import {sum} from './../src/index' 
const {sum, promiseAdd, getAxios} = require('./../src/index' )
const axios = require('axios')
console.log('utils', sum(1,2))
jest.mock('axios');
describe('一个组测试', function(){
    test('sum 1 + 2 =3', ()=>{
        expect(sum(1,2)).toBe(3)
    })

    test('sum 3 + 2 = 5', ()=>{
        expect(sum(3,2)).toBe(5)
    })
})

describe('一个异步测试', function(){
    test('promise add 1+2=3', (done)=>{
        promiseAdd(1,2).then((res)=>{
            expect(res).toBe(3)
            done()
        })
    })
})


function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
        callback(items[index]);
    }
}

describe('测试 mock', () => {
    const mockCallback = jest.fn(x => 42 + x);
    forEach([0, 1], mockCallback);
    console.log('mockCallback.mock', mockCallback.mock);
    // 此 mock 函数被调用了两次
    expect(mockCallback.mock.calls.length).toBe(2);

    // 第一次调用函数时的第一个参数是 0
    expect(mockCallback.mock.calls[0][0]).toBe(0);

    // 第二次调用函数时的第一个参数是 1
    expect(mockCallback.mock.calls[1][0]).toBe(1);

    // 第一次函数调用的返回值是 42
    expect(mockCallback.mock.results[0].value).toBe(42);

    describe('axios', function(){
        test('should fetch users', () => {
            const users = [{name: 'Bob111'}];
            const resp = {data: users};
            axios.get.mockResolvedValue(resp);
            // axios.get.mockImplementationOnce(() => 'first call')
            // or you could use the following depending on your use case:
            // axios.get.mockImplementation(() => Promise.resolve(resp))
            return getAxios().then(data => {
                expect(axios.get).toHaveBeenCalledWith('aaa');
                // console.log('data', data)
                // return expect(data).toEqual(resp)
            });
        });
    })
})
