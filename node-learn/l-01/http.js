const http = require('http');

const server = http.createServer((req, res)=>{
    getPrototypeChain(req)
    res.end('fuck')
})

server.listen(3000)

function getPrototypeChain(obj){
    const protoChain = []
    console.log(Object.getPrototypeOf(obj))
    // 通过while一直对obj赋值，获取原型链上继承的原型链，直到没有原型链为止
    while(obj = Object.getPrototypeOf(obj)){    // 方法返回指定对象的原型（内部[[Prototype]]属性的值）
        protoChain.push(obj)
    }

    console.log(protoChain)
}
