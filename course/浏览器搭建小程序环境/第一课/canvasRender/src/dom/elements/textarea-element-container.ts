import {ElementContainer} from '../element-container';
export class TextareaElementContainer extends ElementContainer {
    readonly value: string;
    constructor(element: HTMLTextAreaElement) {
        super(element);
        //textarea里面的输入的值
        this.value = element.value;
    }
}
