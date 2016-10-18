'use strict';

import './../css/component.css';	
//插入的样式直接在html文件中插入style！不同文件的插入不同style标签里。

/*module.exports = function () {
    var element = document.createElement('h1');

    element.innerHTML = 'Hello world121';

    return element;
};*/

import React from 'react';
class Hello extends React.Component {
  render() {
    return <h1>Hello world</h1>;
  }
}
export default Hello;