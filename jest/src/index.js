const axios = require('axios')

function sum(a,b){
    return a + b
}

function promiseAdd(a, b){
    return Promise.resolve(a + b)
}

function getAxios(){
    return axios.get('aaa')
}


// class A{
//     async open(){
//         return this.status = 'on'
//     }

//     async close(){
//         return this.status = 'off'
//     }

//     static B(){
//         console.log('abab')
//     }
// }

// let a = new A();
// console.log('a.status 0', a.status)
// let res1 = a.open();
// console.log('a.status 0.1', a.status)
// let res2 = a.close();
// console.log('a.status 1', a.status)
// res1 = await res1;
// console.log('a.status 2', a.status)
// res2 = await res2;
// console.log('a.status 3', a.status)
// console.log(res1, res2)
module.exports = {
    sum,
    promiseAdd,
    getAxios
}