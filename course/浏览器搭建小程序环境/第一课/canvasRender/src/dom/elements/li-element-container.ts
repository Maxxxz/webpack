import {ElementContainer} from '../element-container';
export class LIElementContainer extends ElementContainer {
    readonly value: number;

    constructor(element: HTMLLIElement) {
        super(element);
        this.value = element.value;//value值，可以构建起来不同的排序顺序
    }
}
