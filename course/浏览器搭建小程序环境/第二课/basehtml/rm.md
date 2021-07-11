小程序 浏览器运行

1. 浏览器渲染  硬件加速

    Chrome 事件 微任务==> 同步执行

2. 小程序底层架构实现 wxml wxss js


3. 小程序代码实现浏览器运行




1. 解析dom  dom Tree
2. css Tree 
3. layout tree
4. js
渲染



浏览器进程
    ui  ==>
    网络    跨域？ DNS TCP TLS MIME
    文件 
渲染进程  
    合成线程  处理事件是否需要经过主线  blink
        接受事件，判断是否需要主线程参与


         绘制记录表==》合成线程
         layer ==> 图块 ==>

         栅格化之后的内存地址（像素信息）
         图块 、layer==>    绘制四边形（draw quads）

    主线程    运行环境 V8=>js  html\css渲染引擎  GC==> v8 
     1. requestAnimationFrame
     2. parse html    dom Tree 
     3. css parse     css Tree
        微任务是在结构阶段同步执行
        https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model
    
    4. layout Tree 
        位置 大小 内容
        先后顺序
    5. layer Tree

    6. paint 
        layer==> 数据 
        绘图指令 ==> 绘制记录表 

    
        
    tile work
        接受图块信息 ==> 绘制记录表的指令（layer Tree）

GPU 
    GPU



js线程  html

深度优先 

广度优先 

构造 
class A{
    constructor(){

    }
    ~A(){

    }
}

析构 


元素节点
1. 边框 背景  子元素 {其他元素、文本、图片}

dom Tree 
css Tree 
Layout Tree(RenderObject Tree)
Layer  Tree(RenderLayer Tree) ；层叠上下文

compostion Layer 物理意义 像素 内存空间储存




https://www.w3.org/TR/css-position-3/#painting-order





fiber 可中断

skia

栅格化 

几何数据 ==> 像素数据
CPU  软件栅格化 栅格化之后的数据==> CPU ==>GPU  同一块内存区域栅格化
GPU+CPU   单独开辟内存 CPU   GPU   


三个顶点 线条

{
    point:[]
    line:
}

CPU ==> 
GPU 像素数据 ==> 内存 图块

1000
16

非快速滚动区域 


3D 


CPU  二进制加法  控制单元   存储单元  
同步执行
1+1=2  
1-1=0  





webgl != 3d 
webgl  前端浏览器面相与GPU编程的接口

GPU  二进制加法  控制单元   存储单元 
并行执行 
1+1
1-1

https://github.com/WebKit/WebKit/blob/c1a6c5df10fb767d5e341b18e37217dd8237e4fd/Source/WebCore/rendering/RenderLayerCompositor.h#L59


libuv   setTimeout
1.  事件回调 、ajax回调、setTimeout   =>js
2. 解构 检查微任务集合任务=>js
3. 判断当前这一帧是否需要重新渲染  

4.requestANimationFrame回调 =>js
5. 渲染 
6.requestIdleCallback  js
https://github.com/WebKit/WebKit/blob/c1a6c5df10fb767d5e341b18e37217dd8237e4fd/Source/WebCore/dom/EventLoop.cpp#L103




 setTimeOut(()=>{
     consol.log(1)；
     Promise.reslove(()=>{
         console.log(5)
     })
 },);

 //退出当前js执行环境的时候 


https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/public/platform/task_type.h

一灯提供的服务：

- 终生24小时的疑问答疑
- 一对一简历定制化修改
- 每日算法及面试题陪练
- 一对一面试指导、复盘
- 不止于一线所有大厂直达leader内推资源
- 持续更新面试题库与面试经验开放
- 不定期线下聚会、线下资源链接
- 持续更新的技术陪同服务
- 不定期新技术实战训练营

https://source.chromium.org/chromium/chromium/src/+/master:base/message_loop/message_pump_default.cc;l=29

web 