import {CSSParsedDeclaration} from '../css/index';
import {TextContainer} from './text-container';
import {Bounds, parseBounds} from '../css/layout/bounds';
import {isHTMLElementNode} from './node-parser';
//不同的标识
export const enum FLAGS {
    CREATES_STACKING_CONTEXT = 1 << 1,//层叠上下文|因为postion和float造成的，这种需要考虑位置偏移等等
    CREATES_REAL_STACKING_CONTEXT = 1 << 2,//层叠上下文|因为z-index、opacity、transform、translate、body等原因
    IS_LIST_OWNER = 1 << 3//列表类型
}

/**
 * 正常元素处理   layout  
 */
export class ElementContainer {
    readonly styles: CSSParsedDeclaration;
    readonly textNodes: TextContainer[];
    readonly elements: ElementContainer[];
    bounds: Bounds;
    flags: number;//容器不同类型的标识

    constructor(element: Element) {
        //TODO: 首先需要解析样式，把样式的值，处理为数值化的值，后续在绘图时，根据属性反向处理；
        this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));
        this.textNodes = [];
        this.elements = [];
        //判断元素是否有变化，重置为默认
        if (this.styles.transform !== null && isHTMLElementNode(element)) {
            // getBoundingClientRect 已经把transform的变换考虑在内部
            element.style.transform = 'none';
        }
        
        //获取元素位置以及大小
        this.bounds = parseBounds(element);
        this.flags = 0;
    }
}
