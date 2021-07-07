import { canvasRender } from './src'


const canvas = document.getElementById('canvas');
canvas.height = document.documentElement.clientHeight;
canvas.width = document.documentElement.clientWidth;


const renderHtmlString = `
<html>
<head>
  <style>
      div {
        padding: 10px;
        text-align: center;
      }
      b {
        font-family: sans-serif;
      }
      #abs1 {
        position: absolute;
        width: 150px;
        height: 200px;
        top: 10px;
        right: 140px;
        border: 1px solid #900;
        background-color: #fdd;
      }
      #sta1 {
        height: 100px;
        border: 1px solid #996;
        background-color: #ffc;
        margin: 0px 10px 0px 10px;
        text-align: left;
      }
      #flo1 {
        margin: 0px 10px 0px 20px;
        float: left;
        width: 150px;
        height: 200px;
        border: 1px solid #090;
        background-color: #cfc;
      }
      #flo2 {
        margin: 0px 20px 0px 10px;
        float: right;
        width: 150px;
        height: 200px;
        border: 1px solid #090;
        background-color: #cfc;
      }
      #abs2 {
        position: absolute;
        width: 150px;
        height: 100px;
        top: 130px;
        left: 100px;
        border: 1px solid #990;
        background-color: #fdd;
      }
      body{
        background:#ff0000;
      }
  </style>
</head>
<body>
   <div id="abs1">
      <b>DIV #1</b><br>position: absolute;
  </div>
  <div id="flo1">
    <b>DIV #2</b><br>float: left;
  </div>
  <div id="flo2">
    <b>DIV #3</b><br>float: right;
  </div>
  <br>
  <div id="sta1">
    <b>DIV #4</b><br>no positioning
  </div>
  <div id="abs2">
    <b>DIV #5</b><br>position: absolute;
  </div>
</body>
</html>`

canvasRender(renderHtmlString, canvas);