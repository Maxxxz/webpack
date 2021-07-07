import {ElementContainer, FLAGS} from '../dom/element-container';
import {contains} from '../core/bitwise';
import {BoundCurves, calculateBorderBoxPath, calculatePaddingBoxPath} from './bound-curves';
import {ClipEffect, EffectTarget, IElementEffect, TransformEffect} from './effects';
import {OVERFLOW} from '../css/property-descriptors/overflow';
import {equalPath} from './path';
import {DISPLAY} from '../css/property-descriptors/display';
import {OLElementContainer} from '../dom/elements/ol-element-container';
import {LIElementContainer} from '../dom/elements/li-element-container';
import {createCounterText} from '../css/types/functions/counter';

export class StackingContext {
    element: ElementPaint;
    negativeZIndex: StackingContext[];
    zeroOrAutoZIndexOrTransformedOrOpacity: StackingContext[];
    positiveZIndex: StackingContext[];
    nonPositionedFloats: StackingContext[];
    nonPositionedInlineLevel: StackingContext[];
    inlineLevel: ElementPaint[];
    nonInlineLevel: ElementPaint[];

    // inlineLevel - 内联元素
    // negativeZIndex - zIndex为负的元素
    // nonInlineLevel - 非内联元素
    // nonPositionedFloats - 未定位的浮动元素
    // nonPositionedInlineLevel - 内联的非定位元素，包含内联表和内联块
    // positiveZIndex - z-index大于等于1的元素
    // zeroOrAutoZIndexOrTransformedOrOpacity - 所有有层叠上下文的（z-index: auto|0）、透明度小于1的（opacity小于1）或变换的（transform不为none）元素

    constructor(container: ElementPaint) {
        this.element = container;
        this.inlineLevel = [];
        this.nonInlineLevel = [];
        this.negativeZIndex = [];
        this.zeroOrAutoZIndexOrTransformedOrOpacity = [];
        this.positiveZIndex = [];
        this.nonPositionedFloats = [];
        this.nonPositionedInlineLevel = [];
    }
}

/**
 * 根据元素，构建更加详细的paint数据，比如元素的弧度、元素的位置变换,
 */
export class ElementPaint {
    container: ElementContainer;
    effects: IElementEffect[];
    curves: BoundCurves;
    listValue?: string;

    constructor(element: ElementContainer, parentStack: IElementEffect[]) {
        this.container = element;
        this.effects = parentStack.slice(0);
        //元素圆弧处理
        this.curves = new BoundCurves(element); //元素弯曲的属性
        /**
        TODO:
        需要处理一些副作用的情况
        */
        if (element.styles.transform !== null) {
            const offsetX = element.bounds.left + element.styles.transformOrigin[0].number; //确定x的位置
            const offsetY = element.bounds.top + element.styles.transformOrigin[1].number; //确定y的位置
            const matrix = element.styles.transform; //确定元素的变化矩阵
             //当前元素的一些副作用列表，比如位置形状变换
            this.effects.push(new TransformEffect(offsetX, offsetY, matrix));
        }

        //x轴有滚动的情况
        if (element.styles.overflowX !== OVERFLOW.VISIBLE) {
            const borderBox = calculateBorderBoxPath(this.curves);
            const paddingBox = calculatePaddingBoxPath(this.curves);

            if (equalPath(borderBox, paddingBox)) {
                //添加元素的一些副作用情况,边框，内外边距
                this.effects.push(new ClipEffect(borderBox, EffectTarget.BACKGROUND_BORDERS | EffectTarget.CONTENT)); //
            } else {
                this.effects.push(new ClipEffect(borderBox, EffectTarget.BACKGROUND_BORDERS));
                this.effects.push(new ClipEffect(paddingBox, EffectTarget.CONTENT));
            }
        }
    }

    getParentEffects(): IElementEffect[] {
        const effects = this.effects.slice(0);
        if (this.container.styles.overflowX !== OVERFLOW.VISIBLE) {
            const borderBox = calculateBorderBoxPath(this.curves);
            const paddingBox = calculatePaddingBoxPath(this.curves);
            if (!equalPath(borderBox, paddingBox)) {
                effects.push(new ClipEffect(paddingBox, EffectTarget.BACKGROUND_BORDERS | EffectTarget.CONTENT));
            }
        }
        return effects;
    }
}

const parseStackTree = (
    parent: ElementPaint,
    stackingContext: StackingContext,
    realStackingContext: StackingContext,
    listItems: ElementPaint[]
) => {
    /**
     遍历当前元素所有子元素，处理层叠上下文
    */
    parent.container.elements.forEach(child => {

        //TODO:计算当前容器是否需要构建上下文
        const treatAsRealStackingContext = contains(child.flags, FLAGS.CREATES_REAL_STACKING_CONTEXT);
        const createsStackingContext = contains(child.flags, FLAGS.CREATES_STACKING_CONTEXT);

        //构建子元素新的paint数据
        const paintContainer = new ElementPaint(child, parent.getParentEffects());

        //https://developer.mozilla.org/en-US/docs/Web/CSS/display-listitem
        //对于display展示listItem的情况，需要单独处理
        if (contains(child.styles.display, DISPLAY.LIST_ITEM)) {
            listItems.push(paintContainer);
        }

        const listOwnerItems = contains(child.flags, FLAGS.IS_LIST_OWNER) ? [] : listItems;

        /**
            处理各种构建与不构建层叠上下文的情况
        */
        if (treatAsRealStackingContext || createsStackingContext) {

            /**
             TODO: 
             1. 基于当前的绘制数据，构建新的层叠上下文
             */
            const parentStack =
                treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;
            
            const stack = new StackingContext(paintContainer);
            //判断属于哪一种层叠的位置
            // https://www.w3.org/TR/2015/WD-SVG2-20150915/render.html
            // 
            if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {
                const order = child.styles.zIndex.order;
                if (order < 0) {
                    let index = 0;

                    parentStack.negativeZIndex.some((current, i) => {
                        if (order > current.element.container.styles.zIndex.order) {
                            index = i;
                            return false;
                        } else if (index > 0) {
                            return true;
                        }

                        return false;
                    });
                    parentStack.negativeZIndex.splice(index, 0, stack);
                } else if (order > 0) {
                    let index = 0;
                    parentStack.positiveZIndex.some((current, i) => {
                        if (order > current.element.container.styles.zIndex.order) {
                            index = i + 1;
                            return false;
                        } else if (index > 0) {
                            return true;
                        }

                        return false;
                    });
                    parentStack.positiveZIndex.splice(index, 0, stack);
                } else {
                    parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack);
                }
            } else {
                if (child.styles.isFloating()) {
                    parentStack.nonPositionedFloats.push(stack);
                } else {
                    parentStack.nonPositionedInlineLevel.push(stack);
                }
            }

            parseStackTree(
                paintContainer,
                stack,
                treatAsRealStackingContext ? stack : realStackingContext,
                listOwnerItems
            );
        } else {
        /**
            不构建
            1.内联元素的情况
            2.非内联元素的情况
        */
            if (child.styles.isInlineLevel()) {
                stackingContext.inlineLevel.push(paintContainer);
            } else {
                stackingContext.nonInlineLevel.push(paintContainer);
            }

            parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);
        }

        //对于list节点单独处理
        if (contains(child.flags, FLAGS.IS_LIST_OWNER)) {
            processListItems(child, listOwnerItems);
        }
    });
};

//TODO:需要处理列表的各种listItem，实心、空心、方格、图片等等，排序处理
const processListItems = (owner: ElementContainer, elements: ElementPaint[]) => {
    let numbering = owner instanceof OLElementContainer ? owner.start : 1;
    const reversed = owner instanceof OLElementContainer ? owner.reversed : false;
    for (let i = 0; i < elements.length; i++) {
        const item = elements[i];
        if (
            item.container instanceof LIElementContainer &&
            typeof item.container.value === 'number' &&
            item.container.value !== 0
        ) {
            numbering = item.container.value;
        }
        //https://developer.mozilla.org/zh-CN/docs/Web/CSS/list-style-type
        item.listValue = createCounterText(numbering, item.container.styles.listStyleType, true);

        numbering += reversed ? -1 : 1;
    }
};

export const parseStackingContexts = (container: ElementContainer): StackingContext => {
    /**
     * TODO:
    1. 构建每个元素的绘制基本数据
    2. 创建层叠上下文，递归处理元素
    3. 处理列表元素动态排序的情况
     */
    const paintContainer = new ElementPaint(container, []); //当前元素的位置绘制信息
    const root = new StackingContext(paintContainer); //创建层叠上下文对象
    const listItems: ElementPaint[] = [];
    //TODO: 需要根据样式来区分收集到不同的层叠上下文，处理层叠顺序，以及收集列表的选项
    parseStackTree(paintContainer, root, root, listItems); 
    //处理列表项，对于有序列表，需要对其排序
    processListItems(paintContainer.container, listItems); 
    return root;
};
