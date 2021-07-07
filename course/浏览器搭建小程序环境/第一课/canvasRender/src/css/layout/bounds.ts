export class Bounds {
    readonly top: number;
    readonly left: number;
    readonly width: number;
    readonly height: number;

    constructor(x: number, y: number, w: number, h: number) {
        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
    }
    /**
     * 在原有的bounds基础之上，修改数据生成新的Bounds
     */
    add(x: number, y: number, w: number, h: number): Bounds {
        return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);
    }

    static fromClientRect(clientRect: ClientRect): Bounds {
        return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
    }
}

/**
 * 计算任意传入的元素的数据
 * @param {Element} node 传入的元素节点
 */
export const parseBounds = (node: Element): Bounds => {
    //getBoundingClientRect-->返回元素的大小及其相对于视口的位置--https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect
    return Bounds.fromClientRect(node.getBoundingClientRect());
};

/**
 * 计算document对象的宽高和左右距离
 */
export const parseDocumentSize = (document: Document): Bounds => {
    const body = document.body; //当前文档的body元素
    const documentElement = document.documentElement; //文档对象的根元素 html

    if (!body || !documentElement) {
        throw new Error(`Unable to get document size`);
    }

    const width = Math.max(
        Math.max(body.scrollWidth, documentElement.scrollWidth),
        Math.max(body.offsetWidth, documentElement.offsetWidth),
        Math.max(body.clientWidth, documentElement.clientWidth)
    );

    const height = Math.max(
        Math.max(body.scrollHeight, documentElement.scrollHeight),
        Math.max(body.offsetHeight, documentElement.offsetHeight),
        Math.max(body.clientHeight, documentElement.clientHeight)
    );

    return new Bounds(0, 0, width, height); //返回Bounds实例
};
