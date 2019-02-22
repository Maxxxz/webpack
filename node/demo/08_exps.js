//node中js文件代码，都被包裹在下面函数里面

// (
//   function(exports, require, module, __filename, __diename){
//     //code
//   }
// )

//实际
//区分只有，一个是对象，一个是对象的引用快捷方式
console.log(exports === module.exports)  //true

//输出时候的区别
// exports.test = xx;  //因为不能修改快捷方式的指向！
// module.exports = {a:1};

