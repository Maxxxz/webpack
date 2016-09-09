// ES6 相对路径
import utils from './../utils.js';
// ES6 绝对路径
// import utils from '/utils.js';

export default function (argument) {
	console.log('MyModule',this);
	utils();
}