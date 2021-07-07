基于canvas搭建浏览器渲染

8:05开始 

canvas 背后 

webgl
canvas 

canvas api 

canvas 拾取 

绘图引擎

1. 拾取   ==>  
2. 分层  ==> 舞台   ??
    web worker |频繁|大量 ==>阻塞 数据传递   postmessage ==>  结构化克隆算法 
    拷贝 ？？ 

3. 局部绘制


4. 事件封装


经纬度==》 画布可绘制范围

svg  


全量绘图 


js 渲染 

v8 + skia + 事件循环



v8 ==> 执行js 机器 软件   

1. 在什么地方运行    线程 v8 
2. 运行什么 代码  进程 

v8 线程  主线程渲染

webkit  软件 HTML css

主线程 

js  v8   |  webkit html css 


js 线程 


js GC    js 执行  


js + skia (2d 引擎画布 c++) 

HTML、css ==> skia


浏览器 ： 

浏览器进程 
    - 网络线程  MIME CROS html 
    - ui线程 
    - io 
渲染进程
    如果你的页面 、没有绑定事件 ==》 no main 
                                no mian 
    - 合成线程 1    控制主线程的生成、 事件的传递  

    - 主线程 2  ==>  运行各种软件 v8 webkit GC js阻塞
    一帧
        - requestAimationFrame  上一帧渲染js 注册的函数
        - paseHTML ==> webkit
            - Evaluate Script   ==> v8 

                 - Compile Script  ==> v8 \ GC
        - paseHTML    ==> DOM Tree
            Recalculate Style  ==> CSS Tree 
            layout    ==>layout Tree (每一个节点、位置、 大小 、颜色)

            red\yellow \blue  ==> #ff0000
        - Update Layer Tree   分层(层叠上下文) 按照层级绘制
            opacity  0.9999
            contain 
            will-change: tranform
            z-index 1
        
        - paint
            绘制记录表  (绘制指令的集合)

        - Composite Layers
            绘制记录表  ==> 合成线程  ==> 图块 

            非快速滚动区域

    - tile work 3
     图块  ==> tile work | 栅格化  ==> 合成线程  绘制四边形（draw quad） {
         图块 :
         栅格化之后的数据存储的内存地址
     }
        {
            line 
            color
            point{
                {x,y}
               {x,y}
                {x,y}
            }
        }
        ==>
        GPU 
        {
             {x,y,color}
             {x,y,color}
             {x,y,color}
             {x,y,color}
             {x,y,color}
             {x,y,color}
             {x,y,color}
        }
GPU  

https://www.w3.org/TR/CSS2/visuren.html#propdef-z-index

the background and borders of the element forming the stacking context.
the child stacking contexts with negative stack levels (most negative first).
the in-flow, non-inline-level, non-positioned descendants.
the non-positioned floats.
the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
the child stacking contexts with positive stack levels (least positive first).



flutter ==> 
1. html 
2. canvas  dart weight ==> json => skia 



quickjs + skia ()


webkit      webview  
svg  html    xml (重绘重排)   skia 
<rect>
<circle>
<path ....>
canvas  skia 

```html
    <style>
        .box{
            height:30px;
        }
    </style>
    <body>
        <div class='box'> 12</div>
    </body>
```


https://learnxinyminutes.com/
浏览器提供默认样式  ==>默认样式结合
1. 默认样式的结合  || 所有元素 => 

2. 子元素继承父元素的规范 
3. 父子元素结合的计算 

文档字符串 HTML  ==> docuemnt



red yellow   canvas => 

复利  