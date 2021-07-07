import {ElementContainer} from '../element-container';
export class OLElementContainer extends ElementContainer {
    readonly start: number;
    readonly reversed: boolean;

    constructor(element: HTMLOListElement) {
        super(element);
        //ol元素可以控制排序的属性
        this.start = element.start;
        this.reversed = typeof element.reversed === 'boolean' && element.reversed === true;
    }
}
