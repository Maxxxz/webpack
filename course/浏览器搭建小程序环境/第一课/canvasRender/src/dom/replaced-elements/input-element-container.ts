import {ElementContainer} from '../element-container';
import {BORDER_STYLE} from '../../css/property-descriptors/border-style';
import {BACKGROUND_CLIP} from '../../css/property-descriptors/background-clip';
import {BACKGROUND_ORIGIN} from '../../css/property-descriptors/background-origin';
import {TokenType} from '../../css/syntax/tokenizer';
import {LengthPercentageTuple} from '../../css/types/length-percentage';
import {Bounds} from '../../css/layout/bounds';

const CHECKBOX_BORDER_RADIUS: LengthPercentageTuple = [
    {
        type: TokenType.DIMENSION_TOKEN,
        flags: 0,
        unit: 'px',
        number: 3
    }
];

const RADIO_BORDER_RADIUS: LengthPercentageTuple = [
    {
        type: TokenType.PERCENTAGE_TOKEN,
        flags: 0,
        number: 50
    }
];

const reformatInputBounds = (bounds: Bounds): Bounds => {
    if (bounds.width > bounds.height) {
        return new Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);
    } else if (bounds.width < bounds.height) {
        return new Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);
    }
    return bounds;
};

const getInputValue = (node: HTMLInputElement): string => {
    const value = node.type === PASSWORD ? new Array(node.value.length + 1).join('\u2022') : node.value;

    return value.length === 0 ? node.placeholder || '' : value;
};

export const CHECKBOX = 'checkbox';
export const RADIO = 'radio';
export const PASSWORD = 'password';
export const INPUT_COLOR = 0x2a2a2aff;

/**
 * 对于input输入框的一些处理逻辑
 */
export class InputElementContainer extends ElementContainer {
    readonly type: string;
    readonly checked: boolean;
    readonly value: string;

    constructor(input: HTMLInputElement) {
        super(input);
        //对于input元素，需要考虑不同的类型
        this.type = input.type.toLowerCase();
        this.checked = input.checked;//获取check值
        this.value = getInputValue(input);//获取input显示的值，分为密码、当前输入值、placeholder的展示情况

        //当对应的input类型为单选或者多选的时候，需要做一些处理
        if (this.type === CHECKBOX || this.type === RADIO) {
            //背景颜色处理
            this.styles.backgroundColor = 0xdededeff;
            //边框样式处理
            this.styles.borderTopColor = this.styles.borderRightColor = this.styles.borderBottomColor = this.styles.borderLeftColor = 0xa5a5a5ff;
            this.styles.borderTopWidth = this.styles.borderRightWidth = this.styles.borderBottomWidth = this.styles.borderLeftWidth = 1;
            this.styles.borderTopStyle = this.styles.borderRightStyle = this.styles.borderBottomStyle = this.styles.borderLeftStyle =
                BORDER_STYLE.SOLID;
            //背景的其他样式处理
            this.styles.backgroundClip = [BACKGROUND_CLIP.BORDER_BOX];
            this.styles.backgroundOrigin = [BACKGROUND_ORIGIN.BORDER_BOX];
            //对于计算出来的位置，做一些特定的处理
            this.bounds = reformatInputBounds(this.bounds);
        }

        //根据类型设置边框圆弧等
        switch (this.type) {
            case CHECKBOX:
                this.styles.borderTopRightRadius = this.styles.borderTopLeftRadius = this.styles.borderBottomRightRadius = this.styles.borderBottomLeftRadius = CHECKBOX_BORDER_RADIUS;
                break;
            case RADIO:
                this.styles.borderTopRightRadius = this.styles.borderTopLeftRadius = this.styles.borderBottomRightRadius = this.styles.borderBottomLeftRadius = RADIO_BORDER_RADIUS;
                break;
        }
    }
}
