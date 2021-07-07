import { textToDoc } from './dom/util'
import { DocumentCloner } from './dom/document-cloner'
import { Parser } from './css/syntax/parser';
import { color } from './css/types/color';
import { parseTree } from './dom/node-parser';
import { CanvasRenderer } from './render/canvas/canvas-renderer';
import { CacheStorage } from './core/cache-storage'

export const canvasRender = (htmlString, canvas) => {

    const width = canvas.width, height = canvas.height;


    //基于文本，构造新的document
    const ownerDocument = document;
    const defaultView = ownerDocument.defaultView;
    const cloneDocument = textToDoc(htmlString);

    //还没有结合渲染引擎的各种样式
    console.log(cloneDocument);

    //构造克隆器
    let documentCloner = new DocumentCloner(cloneDocument);
    documentCloner.toIFrame(ownerDocument, { width, height });

    //构造之后要渲染的节点
    /*
    TODO: 
    为什么需要把节点放在浏览器中构造一次？
    因为所有的节点和文字等元素，对于不同的浏览器都有自己的基本样式
    对于不同的渲染引擎而言，大体都会遵守W3C的规则，比如块级元素宽度是铺满等等
    */
    let clonedElement = documentCloner.cloneElement;
    console.log(clonedElement);



    /***
    TODO: 
    创建解析color的函数，对于颜色值在浏览器中有一个特点，canavs能够识别的颜色只能够是rgb或者16进制，
    但是在浏览器中，可以是red、yellow等等，所以这块也需要对于获取到的整个文档的颜色值有一个解析；
    
    按照W3规范，解析css的属性值，构建基本的token;
    
    */
    const parseColor = (value) => color.parse(Parser.create(value).parseComponentValue());

    const bgColor = parseColor(getComputedStyle(clonedElement.body).backgroundColor);

    console.log(bgColor, '颜色值');

    //构建缓存加载器
    const cacheInstance = CacheStorage.create('render', {
        imageTimeout: 2000,
        useCORS: true,
        allowTaint: true
    });
    CacheStorage.attachInstance(cacheInstance);



    //构建基本绘图的信息
    const renderOptions = {
        id: Math.round(),
        canvas: canvas,
        backgroundColor: bgColor, //背景色
        scale: 1,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height
    };

    /*
    TODO:
        构建返回基本的数据格式：
        需要包含：
        - 当前元素类型   falg
        - 文本元素的情况(需要包含文字)
        - 大小与位置
        - 被解析之后的样式属性值(可数值化)
        - 当前元素的子元素集合

        构建对应的每一个元素的位置和大小，分析元素计算

        对于不同的元素，有不同的处理点，比如图片类型，还需要处理图片资源，以及src的属性等、input有value的情况
    */
    const root = parseTree(clonedElement.documentElement);

    console.log(root)

    /**
     TODO:
     基于配置，创建渲染器
     */
    const renderer = new CanvasRenderer(renderOptions);

    renderer.render(root);
}