小程序 浏览器运行

1. 浏览器渲染  硬件加速

    Chrome 事件 微任务==> 同步执行

2. 小程序底层架构实现 wxml wxss js


3. 小程序代码实现浏览器运行


// https://ke.qq.com/webcourse/3582488/103725264#taid=11437416308451864&vid=3701925920499193448

1. 解析dom  dom Tree
2. css Tree 
3. layout tree
4. js
渲染



一、浏览器进程
    ui  ==> 除了webview里其他界面的渲染。但是会处理webview里的点击，并且通过通信告诉合成线程你被点击了
    网络    跨域？ DNS TCP TLS MIME
    文件 

二、渲染进程 （3个 合成线程，主线程，tile work） 
1、合成线程(比如页面滑动，就没有经过主线程触发，走合成线程做界面的渲染)  
    1. 处理事件是否需要经过主线  （可看 blink源码）
    2. 接收事件（比如点击和滑动事件），判断是否需要主线程参与。但判断不用主线程参与，会继续执行对应的效果，比如真实的滚动
2、主线程（js，html/css渲染引擎执行的线程） 
浏览器渲染本质是绘图--底层是skia（canvas底层实现也是基于这个的）   
    包含的环境有：
    - 运行环境 V8=>js 
    - html\css渲染引擎  
    - GC==> v8（所以内存回收的时候会阻塞主线程）
 
     1. window.requestAnimationFrame（当前帧注册事件，下一帧调用）
     2. parse html    dom Tree 
     3. css parse     css Tree
   
        **微任务是在解构阶段同步执行**
        w3c对事件循环的解释： https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model
        
    4. layout Tree （绘制的载体）
    - 此树包含 位置 大小 内容，不包含？先后顺序
    - 影响层叠上下文的属性：z-index，opacity等，完整参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
    - 3D加速会让页面分层
    - 绘制的内容：
        元素节点
        - 边框 背景  子元素 {其他元素、文本、图片}

    5. layer Tree（层叠上下文树）

    6. paint（绘制阶段） 
        layer ==> 数据 
        绘图指令 ==> 绘制记录表 
    7. Composite (合成阶段)
        - 包含了3D加速等


3、tile work

三、GPU 
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

析构 (当前类要被生成/注销的 时候执行)（生成是实例化吗？）




其他：
    fiber 可中断机制和恢复机制