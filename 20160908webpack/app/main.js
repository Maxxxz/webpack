'use strict';
//4 css
import './../css/main.css';	//插入的样式直接在html文件中插入style!
/*
//1基本
var component = require('./component.js');
document.body.appendChild(component());
*/

//2import
// import MyModule from './../modules/MyModule.js';
// MyModule();

//3.react
/*import React from 'react';
import ReactDOM from 'react-dom';	//ReactDom要搭配react一起才能用！！
import Hello from './component';


main();

function main() {
    ReactDOM.render(<Hello />, document.getElementById('app'));
}*/


//4alias
import al from 'testalias';
console.log(al);

import al2 from 'acom/testalias';
console.log(al2);


//5redux
import manStore from './../store/index.js'
import {ChangeMax, ChangeMao} from './../action/index.js'

let store = manStore();

let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
);

store.dispatch(ChangeMax());
store.dispatch(ChangeMao());