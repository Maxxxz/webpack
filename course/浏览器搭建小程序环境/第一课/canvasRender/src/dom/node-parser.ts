import {CSSParsedDeclaration} from '../css/index';
import {ElementContainer, FLAGS} from './element-container';
import {TextContainer} from './text-container';
import {ImageElementContainer} from './replaced-elements/image-element-container';
import {CanvasElementContainer} from './replaced-elements/canvas-element-container';
import {SVGElementContainer} from './replaced-elements/svg-element-container';
import {LIElementContainer} from './elements/li-element-container';
import {OLElementContainer} from './elements/ol-element-container';
import {InputElementContainer} from './replaced-elements/input-element-container';
import {SelectElementContainer} from './elements/select-element-container';
import {TextareaElementContainer} from './elements/textarea-element-container';
import {IFrameElementContainer} from './replaced-elements/iframe-element-container';

const LIST_OWNERS = ['OL', 'UL', 'MENU'];
/**
 * 构建其他子节点
 * @param node 
 * @param parent 
 * @param root 
 */
const parseNodeTree = (node: Node, parent: ElementContainer, root: ElementContainer) => {
    for (let childNode = node.firstChild, nextNode; childNode; childNode = nextNode) {
        nextNode = childNode.nextSibling;

        /*
        TODO:
        判断要构建的节点是否是文本节点
        文本节点需要插入到父节点的文本内容中
        */
        if (isTextNode(childNode) && childNode.data.trim().length > 0) {
            parent.textNodes.push(new TextContainer(childNode, parent.styles));
        } else if (isElementNode(childNode)) {
        /**
        TODO:
        节点处于元素节点的情况，处理显示的节点
        会形成独立的上下文的元素，添加独特的标识
        需要单独处理的列表，添加独特的标识
        */
            const container = createContainer(childNode);
            if (container.styles.isVisible()) {
                if (createsRealStackingContext(childNode, container, root)) {
                    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
                } else if (createsStackingContext(container.styles)) {
                    container.flags |= FLAGS.CREATES_STACKING_CONTEXT;
                }

                if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
                    container.flags |= FLAGS.IS_LIST_OWNER;
                }

                parent.elements.push(container);
                //继续递归解析构建数据
                if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {
                    parseNodeTree(childNode, container, root);
                }
            }
        }
    }
};

/**
 * 根据不同的元素节点，创建不用的element转化为数据状态的容器
 * @param element 
 * @returns 
 */
const createContainer = (element: Element): ElementContainer => {
    //对于图片元素，构建对应的数据需要有链接和图片的形式
    if (isImageElement(element)) {
        return new ImageElementContainer(element);
    }

    //对于canvas元素也需要做一些处理
    if (isCanvasElement(element)) {
        return new CanvasElementContainer(element);
    }

    //对于svg，需要转换为base的情况
    if (isSVGElement(element)) {
        return new SVGElementContainer(element);
    }

    //对于li元素，需要构建排序顺序
    if (isLIElement(element)) {
        return new LIElementContainer(element);
    }

    //对于ol元素，也有排序的属性，需要记录
    if (isOLElement(element)) {
        return new OLElementContainer(element);
    }

    //对于input元素，需要考虑多种type的处理逻辑
    if (isInputElement(element)) {
        return new InputElementContainer(element);
    }

    //对于下拉select，需要处理下拉值和选项的逻辑
    if (isSelectElement(element)) {
        return new SelectElementContainer(element);
    }

    //处理textarea的输入值
    if (isTextareaElement(element)) {
        return new TextareaElementContainer(element);
    }

    //对于iframe容器，继续处理
    if (isIFrameElement(element)) {
        return new IFrameElementContainer(element);
    }

    //其他普通元素，解析样式，处理位置
    return new ElementContainer(element); //普通元素的container
};
//创建对应解析的数据
export const parseTree = (element: HTMLElement): ElementContainer => {
        //创建容器，根据元素节点类型，构建不同的数据容器
    const container = createContainer(element); 
    
    //对于有些元素会形成层叠上下文，body默认是一个层叠上下文
    container.flags |= FLAGS.CREATES_REAL_STACKING_CONTEXT;
    //解析子元素的内容，不断构建子元素的数据化形式
    parseNodeTree(element, container, container);
    //返回整个容器的数据状态
    return container;
};

const createsRealStackingContext = (node: Element, container: ElementContainer, root: ElementContainer): boolean => {
    return (
        container.styles.isPositionedWithZIndex() ||
        container.styles.opacity < 1 ||
        container.styles.isTransformed() ||
        (isBodyElement(node) && root.styles.isTransparent())
    );
};

const createsStackingContext = (styles: CSSParsedDeclaration): boolean => styles.isPositioned() || styles.isFloating();

//判断文本节点
export const isTextNode = (node: Node): node is Text => node.nodeType === Node.TEXT_NODE;

//判断是元素节点
export const isElementNode = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;

//判断是否是html节点
export const isHTMLElementNode = (node: Node): node is HTMLElement =>
    typeof (node as HTMLElement).style !== 'undefined';
//判断是SVG元素
export const isSVGElementNode = (element: Element): element is SVGElement =>
    typeof (element as SVGElement).className === 'object';
export const isLIElement = (node: Element): node is HTMLLIElement => node.tagName === 'LI';
export const isOLElement = (node: Element): node is HTMLOListElement => node.tagName === 'OL';
export const isInputElement = (node: Element): node is HTMLInputElement => node.tagName === 'INPUT';
export const isHTMLElement = (node: Element): node is HTMLHtmlElement => node.tagName === 'HTML';
export const isSVGElement = (node: Element): node is SVGSVGElement => node.tagName === 'svg';
export const isBodyElement = (node: Element): node is HTMLBodyElement => node.tagName === 'BODY';
//判断是canvas元素
export const isCanvasElement = (node: Element): node is HTMLCanvasElement => node.tagName === 'CANVAS';
export const isImageElement = (node: Element): node is HTMLImageElement => node.tagName === 'IMG';
export const isIFrameElement = (node: Element): node is HTMLIFrameElement => node.tagName === 'IFRAME';
export const isStyleElement = (node: Element): node is HTMLStyleElement => node.tagName === 'STYLE';
export const isScriptElement = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT';
export const isTextareaElement = (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA';
export const isSelectElement = (node: Element): node is HTMLSelectElement => node.tagName === 'SELECT';
