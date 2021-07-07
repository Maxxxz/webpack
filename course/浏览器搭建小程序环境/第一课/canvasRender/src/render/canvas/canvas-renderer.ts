import {ElementPaint, parseStackingContexts, StackingContext} from '../stacking-context';
import {asString, Color, isTransparent} from '../../css/types/color';
import {ElementContainer} from '../../dom/element-container';
import {BORDER_STYLE} from '../../css/property-descriptors/border-style';
import {CSSParsedDeclaration} from '../../css/index';
import {TextContainer} from '../../dom/text-container';
import {Path, transformPath} from '../path';
import {BACKGROUND_CLIP} from '../../css/property-descriptors/background-clip';
import {BoundCurves, calculateBorderBoxPath, calculateContentBoxPath, calculatePaddingBoxPath} from '../bound-curves';
import {isBezierCurve} from '../bezier-curve';
import {Vector} from '../vector';
import {CSSImageType, CSSURLImage, isLinearGradient, isRadialGradient} from '../../css/types/image';
import {parsePathForBorder} from '../border';
import {Cache} from '../../core/cache-storage';
import {calculateBackgroundRendering, getBackgroundValueForIndex} from '../background';
import {isDimensionToken} from '../../css/syntax/parser';
import {TextBounds} from '../../css/layout/text';
import {fromCodePoint, toCodePoints} from 'css-line-break';
import {ImageElementContainer} from '../../dom/replaced-elements/image-element-container';
import {contentBox} from '../box-sizing';
import {CanvasElementContainer} from '../../dom/replaced-elements/canvas-element-container';
import {SVGElementContainer} from '../../dom/replaced-elements/svg-element-container';
import {ReplacedElementContainer} from '../../dom/replaced-elements/index';
import {EffectTarget, IElementEffect, isClipEffect, isTransformEffect} from '../effects';
import {contains} from '../../core/bitwise';
import {calculateGradientDirection, calculateRadius, processColorStops} from '../../css/types/functions/gradient';
import {FIFTY_PERCENT, getAbsoluteValue} from '../../css/types/length-percentage';
import {TEXT_DECORATION_LINE} from '../../css/property-descriptors/text-decoration-line';
import {FontMetrics} from '../font-metrics';
import {DISPLAY} from '../../css/property-descriptors/display';
import {Bounds} from '../../css/layout/bounds';
import {LIST_STYLE_TYPE} from '../../css/property-descriptors/list-style-type';
import {computeLineHeight} from '../../css/property-descriptors/line-height';
import {CHECKBOX, INPUT_COLOR, InputElementContainer, RADIO} from '../../dom/replaced-elements/input-element-container';
import {TEXT_ALIGN} from '../../css/property-descriptors/text-align';
import {TextareaElementContainer} from '../../dom/elements/textarea-element-container';
import {SelectElementContainer} from '../../dom/elements/select-element-container';
import {IFrameElementContainer} from '../../dom/replaced-elements/iframe-element-container';
import {TextShadow} from '../../css/property-descriptors/text-shadow';

export type RenderConfigurations = RenderOptions & {
    backgroundColor: Color | null;
};
/**
 * 绘图配置数据
 */
export interface RenderOptions {
    id: string;
    scale: number;
    canvas?: HTMLCanvasElement;
    x: number;
    y: number;
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
    windowWidth: number;
    windowHeight: number;
    cache: Cache;
}

const MASK_OFFSET = 10000;

//构建渲染引擎
export class CanvasRenderer {
    canvas: HTMLCanvasElement; //canvas元素
    ctx: CanvasRenderingContext2D; //绘图环境
    options: RenderConfigurations; //绘图配置信息
    private readonly _activeEffects: IElementEffect[] = []; 
    private readonly fontMetrics: FontMetrics; 

    constructor(options: RenderConfigurations) {
        //初始化搭建基本配置
        this.canvas = options.canvas ? options.canvas : document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.options = options;
        //设置基本属性
        if (!options.canvas) {
            this.canvas.width = Math.floor(options.width * options.scale);
            this.canvas.height = Math.floor(options.height * options.scale);
            this.canvas.style.width = `${options.width}px`;
            this.canvas.style.height = `${options.height}px`;
        }

        this.fontMetrics = new FontMetrics(document); //控制文字,关于下划线等数据计算
        this.ctx.scale(this.options.scale, this.options.scale); //缩放
        this.ctx.translate(-options.x + options.scrollX, -options.y + options.scrollY); //偏移，使用tranlate来处理位置
        this.ctx.textBaseline = 'bottom'; //文字的基线设置默认是‘textBaseline’
        this._activeEffects = []; //构建渲染的副作用容器
       
    }

    applyEffects(effects: IElementEffect[], target: EffectTarget) {
        while (this._activeEffects.length) {
            //清空_activeEffects
            this.popEffect();
        }

        effects.filter(effect => contains(effect.target, target)).forEach(effect => this.applyEffect(effect));
    }

    applyEffect(effect: IElementEffect) {
        this.ctx.save();
        if (isTransformEffect(effect)) {
            this.ctx.translate(effect.offsetX, effect.offsetY);
            this.ctx.transform(
                effect.matrix[0],
                effect.matrix[1],
                effect.matrix[2],
                effect.matrix[3],
                effect.matrix[4],
                effect.matrix[5]
            );
            this.ctx.translate(-effect.offsetX, -effect.offsetY);
        }

        if (isClipEffect(effect)) {
            this.path(effect.path);
            this.ctx.clip();
        }

        this._activeEffects.push(effect);
    }

    popEffect() {
        this._activeEffects.pop();
        this.ctx.restore();
    }
    //渲染传入的层叠上下文
    async renderStack(stack: StackingContext) {
        const styles = stack.element.container.styles;
        if (styles.isVisible()) {
            //判断是否有展示
            this.ctx.globalAlpha = styles.opacity; //设置全局的透明度
            await this.renderStackContent(stack); //根据层叠上下文渲染内容
        }
    }

    //渲染正常节点
    async renderNode(paint: ElementPaint) {
        if (paint.container.styles.isVisible()) {
            /**
            TODO: 
            1. 渲染节点的背景和边框
            2. 渲染节点具体内容
            */
            await this.renderNodeBackgroundAndBorders(paint);
            await this.renderNodeContent(paint);
        }
    }
    //处理文本字符间距
    renderTextWithLetterSpacing(text: TextBounds, letterSpacing: number) {
        if (letterSpacing === 0) {
            this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height); //直接渲染文字
        } else {
            const letters = toCodePoints(text.text).map(i => fromCodePoint(i));
            letters.reduce((left, letter) => {
                this.ctx.fillText(letter, left, text.bounds.top + text.bounds.height); //拆开计算，再渲染

                return left + this.ctx.measureText(letter).width;
            }, text.bounds.left);
        }
    }
    //根据传入的样式构建font
    private createFontStyle(styles: CSSParsedDeclaration): string[] {
        const fontVariant = styles.fontVariant
            .filter(variant => variant === 'normal' || variant === 'small-caps')
            .join('');
        const fontFamily = styles.fontFamily.join(', ');
        const fontSize = isDimensionToken(styles.fontSize)
            ? `${styles.fontSize.number}${styles.fontSize.unit}`
            : `${styles.fontSize.number}px`;

        return [
            [styles.fontStyle, fontVariant, styles.fontWeight, fontSize, fontFamily].join(' '),
            fontFamily,
            fontSize
        ];
    }
    //渲染处理文字
    async renderTextNode(text: TextContainer, styles: CSSParsedDeclaration) {
        const [font, fontFamily, fontSize] = this.createFontStyle(styles); //传入样式，解析文字相关的样式设置

        this.ctx.font = font; //设置绘图文字的样式

        text.textBounds.forEach(text => {
            this.ctx.fillStyle = asString(styles.color); //设置颜色
            this.renderTextWithLetterSpacing(text, styles.letterSpacing); //渲染文字的时候，处理文本字符间距
            const textShadows: TextShadow = styles.textShadow; //判断文字是否有阴影
            //有阴影的情况，渲染阴影
            if (textShadows.length && text.text.trim().length) {
                textShadows
                    .slice(0)
                    .reverse()
                    .forEach(textShadow => {
                        this.ctx.shadowColor = asString(textShadow.color);
                        this.ctx.shadowOffsetX = textShadow.offsetX.number * this.options.scale;
                        this.ctx.shadowOffsetY = textShadow.offsetY.number * this.options.scale;
                        this.ctx.shadowBlur = textShadow.blur.number;

                        this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
                        //绘制文字阴影
                    });

                this.ctx.shadowColor = '';
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
                this.ctx.shadowBlur = 0;
            }

            //文本线的修饰
            if (styles.textDecorationLine.length) {
                this.ctx.fillStyle = asString(styles.textDecorationColor || styles.color); //填充颜色
                //遍历线的设置
                styles.textDecorationLine.forEach(textDecorationLine => {
                    switch (textDecorationLine) {
                        //处理在底部的情况
                        case TEXT_DECORATION_LINE.UNDERLINE:
                            const {baseline} = this.fontMetrics.getMetrics(fontFamily, fontSize);
                            this.ctx.fillRect(
                                text.bounds.left,
                                Math.round(text.bounds.top + baseline),
                                text.bounds.width,
                                1
                            );

                            break;
                        //顶部穿过的情况
                        case TEXT_DECORATION_LINE.OVERLINE:
                            this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1);
                            break;
                        //中间穿过的情况
                        case TEXT_DECORATION_LINE.LINE_THROUGH:
                            const {middle} = this.fontMetrics.getMetrics(fontFamily, fontSize);
                            this.ctx.fillRect(
                                text.bounds.left,
                                Math.ceil(text.bounds.top + middle),
                                text.bounds.width,
                                1
                            );
                            break;
                    }
                });
            }
        });
    }
    //渲染图片
    renderReplacedElement(
        container: ReplacedElementContainer,
        curves: BoundCurves,
        image: HTMLImageElement | HTMLCanvasElement
    ) {
        if (image && container.intrinsicWidth > 0 && container.intrinsicHeight > 0) {
            const box = contentBox(container); //计算图片的宽高
            const path = calculatePaddingBoxPath(curves); //计算图片容器的圆角等
            this.path(path); //绘制路径
            this.ctx.save();
            this.ctx.clip(); //通过路劲创建剪切区域
            this.ctx.drawImage(
                image,
                0,
                0,
                container.intrinsicWidth,
                container.intrinsicHeight,
                box.left,
                box.top,
                box.width,
                box.height
            ); //绘制图片
            this.ctx.restore();
        }
    }

    /**
     * 渲染某一个元素节点里面的内容，可能是元素、也可能是图片，可能是文字，可能是svg，可能是canvas，可能是视频，可能是input，可能是iframe
     * @param paint ElementPaint
     */
    async renderNodeContent(paint: ElementPaint) {
        this.applyEffects(paint.effects, EffectTarget.CONTENT); //先处理副作用\变换
        const container = paint.container;
        const curves = paint.curves;
        const styles = container.styles;
        //循环处理container元素中的文本节点
        for (const child of container.textNodes) {
            await this.renderTextNode(child, styles); //传入TextContainer
        }

        //图片的情况，渲染图片
        if (container instanceof ImageElementContainer) {
            try {
                const image = await this.options.cache.match(container.src); //获取图片
                this.renderReplacedElement(container, curves, image);
            } catch (e) {
                console.log(`处理图片失败 ${container.src}`)
            }
        }

        //canvas的情况，渲染
        if (container instanceof CanvasElementContainer) {
            this.renderReplacedElement(container, curves, container.canvas);
        }

        //svg的情况，也是直接渲染
        if (container instanceof SVGElementContainer) {
            try {
                const image = await this.options.cache.match(container.svg);
                this.renderReplacedElement(container, curves, image);
            } catch (e) {
                console.log(`处理svg失败 ${container.svg.substring(0, 255)}`)
            }
        }

        //如果是iframe，那么就调用canvasRender，重复渲染页面的过程，最后再绘制到canvas上
        if (container instanceof IFrameElementContainer && container.tree) {
            const iframeRenderer = new CanvasRenderer({
                id: this.options.id,
                scale: this.options.scale,
                backgroundColor: container.backgroundColor,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                width: container.width,
                height: container.height,
                cache: this.options.cache,
                windowWidth: container.width,
                windowHeight: container.height
            });

            const canvas = await iframeRenderer.render(container.tree);
            if (container.width && container.height) {
                this.ctx.drawImage(
                    canvas,
                    0,
                    0,
                    container.width,
                    container.height,
                    container.bounds.left,
                    container.bounds.top,
                    container.bounds.width,
                    container.bounds.height
                );
            }
        }

        //输入框的情况下 ，根据不同的类型来处理（复选框和单选框）
        if (container instanceof InputElementContainer) {
            const size = Math.min(container.bounds.width, container.bounds.height);
            //复选框
            if (container.type === CHECKBOX) {
                if (container.checked) {
                    //当复选框选中的手，绘制选中的样式
                    this.ctx.save();
                    this.path([
                        new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79),
                        new Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549),
                        new Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071),
                        new Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649),
                        new Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23),
                        new Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085),
                        new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)
                    ]);

                    this.ctx.fillStyle = asString(INPUT_COLOR);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            } else if (container.type === RADIO) {
                //单选框
                if (container.checked) {
                    //单选框选中的时候，绘制样式
                    this.ctx.save();
                    this.ctx.beginPath();
                    this.ctx.arc(
                        container.bounds.left + size / 2,
                        container.bounds.top + size / 2,
                        size / 4,
                        0,
                        Math.PI * 2,
                        true
                    );
                    this.ctx.fillStyle = asString(INPUT_COLOR);
                    this.ctx.fill();
                    this.ctx.restore();
                }
            }
        }

        //文本数据框的时候，并且有值
        if (isTextInputElement(container) && container.value.length) {
            [this.ctx.font] = this.createFontStyle(styles); //输入框文字的样式
            this.ctx.fillStyle = asString(styles.color); //颜色

            this.ctx.textBaseline = 'middle'; //上下文字居中
            this.ctx.textAlign = canvasTextAlign(container.styles.textAlign); //水平位置处理

            const bounds = contentBox(container); //计算文字的位置和大小

            let x = 0;

            switch (container.styles.textAlign) {
                case TEXT_ALIGN.CENTER:
                    x += bounds.width / 2;
                    break;
                case TEXT_ALIGN.RIGHT:
                    x += bounds.width;
                    break;
            }

            const textBounds = bounds.add(x, 0, 0, -bounds.height / 2 + 1); //计算文字的位置

            this.ctx.save();
            this.path([
                new Vector(bounds.left, bounds.top),
                new Vector(bounds.left + bounds.width, bounds.top),
                new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
                new Vector(bounds.left, bounds.top + bounds.height)
            ]); //设置输入款的大小和位置

            this.ctx.clip(); //剪切路径区域
            this.renderTextWithLetterSpacing(new TextBounds(container.value, textBounds), styles.letterSpacing); //绘制文字，渲染到输入框里面
            this.ctx.restore();
            this.ctx.textBaseline = 'bottom'; //重新处理绘图环境
            this.ctx.textAlign = 'left'; //重置绘图环境
        }

        //如果当前元素是属于设置了list-item
        if (contains(container.styles.display, DISPLAY.LIST_ITEM)) {
            if (container.styles.listStyleImage !== null) {
                //style为图片
                const img = container.styles.listStyleImage; //获取图片
                if (img.type === CSSImageType.URL) {
                    let image;
                    const url = (img as CSSURLImage).url;
                    try {
                        image = await this.options.cache.match(url); //获取图片资源
                        this.ctx.drawImage(image, container.bounds.left - (image.width + 10), container.bounds.top); //绘制图片
                    } catch (e) {
                        console.log(`处理list-style-image失败 ${url}`)
                    }
                }
            } else if (paint.listValue && container.styles.listStyleType !== LIST_STYLE_TYPE.NONE) {
                //list属于其他情况的style
                [this.ctx.font] = this.createFontStyle(styles);
                this.ctx.fillStyle = asString(styles.color);

                this.ctx.textBaseline = 'middle';
                this.ctx.textAlign = 'right';
                const bounds = new Bounds(
                    container.bounds.left,
                    container.bounds.top + getAbsoluteValue(container.styles.paddingTop, container.bounds.width),
                    container.bounds.width,
                    computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 1
                );

                this.renderTextWithLetterSpacing(new TextBounds(paint.listValue, bounds), styles.letterSpacing);
                this.ctx.textBaseline = 'bottom';
                this.ctx.textAlign = 'left';
            }
        }
    }
    /**
     * stack  层叠上下文 stack content
     * 把不同的类型样式的子元素，分到不同的渠道去整合，stack也是一个树
     * {
     *  element: ElementPaint{
     *              container:ElementContainer,
     *              effects:[],
     *              curves:BoundCurves
     *          },
     *  inlineLevel:[ElementPaint],//内联无样式
     *  nonInlineLevel:[StackingContext],
     *  negativeZIndex:[StackingContext],
     *  zeroOrAutoZIndexOrTransformedOrOpacity:[StackingContext],
     *  positiveZIndex:[StackingContext],
     *  nonPositionedFloats:[StackingContext],
     *  nonPositionedInlineLevel:[StackingContext]
     * }
     */
    async renderStackContent(stack: StackingContext) {
        // https://www.w3.org/TR/css-position-3/#painting-order
        //第一步渲染当前元素的background和border
        await this.renderNodeBackgroundAndBorders(stack.element); 
        //第二步渲染拥有负的z-index的堆栈上下文
        for (const child of stack.negativeZIndex) {
            //渲染新的层叠上下文
            await this.renderStack(child); //传入当前设置了负的z-index的StackingContext
        }
        //第三步、处理流式布局，没有position定位和inline-block的子元素
        await this.renderNodeContent(stack.element); 
        //渲染节点子元素的内容


        //第三步、正常流式布局，非 inline-block，无 position 定位（static除外）的子元素
        for (const child of stack.nonInlineLevel) {
            //NOTE:接新节点的内容，不需要构建新的层叠上下文
            await this.renderNode(child);
        }


        //第四步、无 position 定位（static除外）的 float 浮动元素
        for (const child of stack.nonPositionedFloats) {
            //渲染新的层叠上下文
            await this.renderStack(child); 
        }
        //第五步、正常流式布局， inline-block元素，无 position 定位（static除外）的子元素（包括 display:table 和 display:inline ）
        for (const child of stack.nonPositionedInlineLevel) {
            //渲染新的层叠上下文
            await this.renderStack(child); 
        }
        //第五步、正常流式布局， inline-block元素，无 position 定位（static除外）的子元素（包括 display:table 和 display:inline ）
        for (const child of stack.inlineLevel) {
            //NOTE:渲染节点内容
            await this.renderNode(child); 
        }
        //第六步、z-index为0或者transform、opacity等属性的层叠上下文
        for (const child of stack.zeroOrAutoZIndexOrTransformedOrOpacity) {
            //渲染新的层叠上下文
            await this.renderStack(child); 
        }
        //第七步、拥有正 z-index: 的子堆叠上下文元素（正的越低越堆叠层级越低）
        for (const child of stack.positiveZIndex) {
            //渲染新的层叠上下文
            await this.renderStack(child); 
        }
    }

    mask(paths: Path[]) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.canvas.width, 0);
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.lineTo(0, 0);
        this.formatPath(paths.slice(0).reverse());
        this.ctx.closePath();
    }
    //绘制一个新的路径
    path(paths: Path[]) {
        this.ctx.beginPath(); //开始一个路径
        this.formatPath(paths);
        this.ctx.closePath(); //构建完成
    }
    //构建具体的路径（可能是曲线）
    formatPath(paths: Path[]) {
        paths.forEach((point, index) => {
            const start: Vector = isBezierCurve(point) ? point.start : point;
            if (index === 0) {
                this.ctx.moveTo(start.x, start.y);
            } else {
                this.ctx.lineTo(start.x, start.y);
            }

            if (isBezierCurve(point)) {
                this.ctx.bezierCurveTo(
                    point.startControl.x,
                    point.startControl.y,
                    point.endControl.x,
                    point.endControl.y,
                    point.end.x,
                    point.end.y
                );
            }
        });
    }
    //渲染纹理
    renderRepeat(path: Path[], pattern: CanvasPattern | CanvasGradient, offsetX: number, offsetY: number) {
        this.path(path);
        this.ctx.fillStyle = pattern;
        this.ctx.translate(offsetX, offsetY);
        this.ctx.fill();
        this.ctx.translate(-offsetX, -offsetY);
    }
    //调整图片大小
    resizeImage(image: HTMLImageElement, width: number, height: number): HTMLCanvasElement | HTMLImageElement {
        if (image.width === width && image.height === height) {
            return image;
        }

        const canvas = (this.canvas.ownerDocument as Document).createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
        return canvas;
    }
    //绘制背景元素
    async renderBackgroundImage(container: ElementContainer) {
        let index = container.styles.backgroundImage.length - 1;
        //多个背景重合的情况下，后面的先绘制，置底
        for (const backgroundImage of container.styles.backgroundImage.slice(0).reverse()) {
            if (backgroundImage.type === CSSImageType.URL) {
                //如果当前这个背景是图片
                let image;
                const url = (backgroundImage as CSSURLImage).url; //获取连接
                try {
                    image = await this.options.cache.match(url); //提取资源
                } catch (e) {
                    console.log(`处理 background-image失败 ${url}`)
                }

                if (image) {
                    //如果有资源
                    const [path, x, y, width, height] = calculateBackgroundRendering(container, index, [
                        image.width,
                        image.height,
                        image.width / image.height
                    ]); //计算要渲染的大小，位置，比如cover的情况、content的情况等

                    const pattern = this.ctx.createPattern(
                        this.resizeImage(image, width, height),
                        'repeat'
                    ) as CanvasPattern; //通过创建新的canvas来控制图片的大小，然后以此创建纹理
                    this.renderRepeat(path, pattern, x, y); //把纹理渲染到canvas上
                }
            } else if (isLinearGradient(backgroundImage)) {
                //是线性渐变的情况
                const [path, x, y, width, height] = calculateBackgroundRendering(container, index, [null, null, null]);
                const [lineLength, x0, x1, y0, y1] = calculateGradientDirection(backgroundImage.angle, width, height);


                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
                const gradient = ctx.createLinearGradient(x0, y0, x1, y1); //创建线性渐变的设置

                processColorStops(backgroundImage.stops, lineLength).forEach(colorStop =>
                    gradient.addColorStop(colorStop.stop, asString(colorStop.color))
                ); //在纹理的不同位置添加颜色

                ctx.fillStyle = gradient; //填充颜色设置成纹理
                ctx.fillRect(0, 0, width, height); //绘制
                if (width > 0 && height > 0) {
                    const pattern = this.ctx.createPattern(canvas, 'repeat') as CanvasPattern; //创建纹理
                    this.renderRepeat(path, pattern, x, y); //把纹理绘制到画布上
                }
            } else if (isRadialGradient(backgroundImage)) {
                //径向渐变的情况
                const [path, left, top, width, height] = calculateBackgroundRendering(container, index, [
                    null,
                    null,
                    null
                ]);
                //背景图片计算对应的位置
                const position = backgroundImage.position.length === 0 ? [FIFTY_PERCENT] : backgroundImage.position;
                //计算位置
                const x = getAbsoluteValue(position[0], width); 
                const y = getAbsoluteValue(position[position.length - 1], height);

                const [rx, ry] = calculateRadius(backgroundImage, x, y, width, height); //计算弧度
                if (rx > 0 && rx > 0) {
                    //创建径向渐变
                    const radialGradient = this.ctx.createRadialGradient(left + x, top + y, 0, left + x, top + y, rx);

                    processColorStops(backgroundImage.stops, rx * 2).forEach(colorStop =>
                        radialGradient.addColorStop(colorStop.stop, asString(colorStop.color))
                    ); //分步添加颜色

                    this.path(path); //创建路径
                    this.ctx.fillStyle = radialGradient; //绘制
                    if (rx !== ry) {
                        // transforms for elliptical radial gradient
                        const midX = container.bounds.left + 0.5 * container.bounds.width;
                        const midY = container.bounds.top + 0.5 * container.bounds.height;
                        const f = ry / rx;
                        const invF = 1 / f;

                        this.ctx.save();
                        this.ctx.translate(midX, midY);
                        this.ctx.transform(1, 0, 0, f, 0, 0);
                        this.ctx.translate(-midX, -midY);

                        this.ctx.fillRect(left, invF * (top - midY) + midY, width, height * invF);
                        this.ctx.restore();
                    } else {
                        this.ctx.fill();
                    }
                }
            }
            index--;
        }
    }
    //渲染边框
    async renderBorder(color: Color, side: number, curvePoints: BoundCurves) {
        this.path(parsePathForBorder(curvePoints, side)); //构建路劲，可能是圆弧，因为边框有圆弧的情况
        this.ctx.fillStyle = asString(color); //添加颜色
        this.ctx.fill();
    }
    /**
     * 渲染包容的元素的背景颜色和边框、周边阴影等
     * @param paint 需要绘制元素的elementPaint对象
     */
    async renderNodeBackgroundAndBorders(paint: ElementPaint) {
        this.applyEffects(paint.effects, EffectTarget.BACKGROUND_BORDERS); //执行渲染是否当前元素有其他的副作用，比如位置形状变换
        const styles = paint.container.styles;
        const hasBackground = !isTransparent(styles.backgroundColor) || styles.backgroundImage.length; //是否有背景颜色

        const borders = [
            {style: styles.borderTopStyle, color: styles.borderTopColor},
            {style: styles.borderRightStyle, color: styles.borderRightColor},
            {style: styles.borderBottomStyle, color: styles.borderBottomColor},
            {style: styles.borderLeftStyle, color: styles.borderLeftColor}
        ]; //构建边框

        const backgroundPaintingArea = calculateBackgroundCurvedPaintingArea(
            getBackgroundValueForIndex(styles.backgroundClip, 0),
            paint.curves
        ); //计算背景颜色显示的区域，如果是圆角或者设置了box-sizing，那么就要计算显示的区域

        if (hasBackground || styles.boxShadow.length) {
            //有背景色或者周边有阴影的情况
            this.ctx.save();
            this.path(backgroundPaintingArea); //根据可以绘制的元素的区域，构建路径，形成一个元素区域
            this.ctx.clip(); //创建剪切区域

            if (!isTransparent(styles.backgroundColor)) {
                //不是透明的情况
                this.ctx.fillStyle = asString(styles.backgroundColor); //设置背景颜色
                this.ctx.fill(); //设置填充
            }

            await this.renderBackgroundImage(paint.container); //绘制元素的背景图片

            this.ctx.restore(); //重置绘图环境

            //处理多个阴影的情况下的渲染
            styles.boxShadow
                .slice(0)
                .reverse()
                .forEach(shadow => {
                    this.ctx.save(); //保存当前绘图环境
                    const borderBoxArea = calculateBorderBoxPath(paint.curves); //计算阴影的位置和区域
                    const maskOffset = shadow.inset ? 0 : MASK_OFFSET;
                    const shadowPaintingArea = transformPath(
                        borderBoxArea,
                        -maskOffset + (shadow.inset ? 1 : -1) * shadow.spread.number,
                        (shadow.inset ? 1 : -1) * shadow.spread.number,
                        shadow.spread.number * (shadow.inset ? -2 : 2),
                        shadow.spread.number * (shadow.inset ? -2 : 2)
                    ); //变换移动

                    if (shadow.inset) {
                        this.path(borderBoxArea);
                        this.ctx.clip();
                        this.mask(shadowPaintingArea);
                    } else {
                        this.mask(borderBoxArea);
                        this.ctx.clip();
                        this.path(shadowPaintingArea);
                    }

                    this.ctx.shadowOffsetX = shadow.offsetX.number + maskOffset;
                    this.ctx.shadowOffsetY = shadow.offsetY.number;
                    this.ctx.shadowColor = asString(shadow.color);
                    this.ctx.shadowBlur = shadow.blur.number;
                    this.ctx.fillStyle = shadow.inset ? asString(shadow.color) : 'rgba(0,0,0,1)';

                    this.ctx.fill();
                    this.ctx.restore();
                });
        }

        let side = 0;
        for (const border of borders) {
            //渲染四边的边框
            if (border.style !== BORDER_STYLE.NONE && !isTransparent(border.color)) {
                await this.renderBorder(border.color, side, paint.curves); //渲染每一边
            }
            side++;
        }
    }

    /**
     *
     * 调用render方法，触发container到视图的转换
     * @param {ElementContainer} element 要绘制的元素转换的container
     * @memberof CanvasRenderer
     */
    async render(element: ElementContainer){

        //绘制容器的body
        if (this.options.backgroundColor) {
            this.ctx.fillStyle = asString(this.options.backgroundColor); //配置当前绘图环境的全局
            this.ctx.fillRect(
                this.options.x - this.options.scrollX,
                this.options.y - this.options.scrollY,
                this.options.width,
                this.options.height
            ); //绘制矩形
        }

        /** element-->传入的element的元素
         * {
         *  styles: {
         *      backgroundClip:[],
         *      backgroundColor:'',
         *      ...
         *  },当前元素起到作用的样式表,处理/css/index.ts-->CSSParsedDeclaration解析
         *  textNodes:[{
         *       text:'Render the content in this element',
         *       textBounds:[{text:'Render',bounds:{left:0,top:0,width:'',height:''}}]
         *      }],当前节点的子节点包含文本类型的
         *  elements:[{
         *      container//其他节点类型的容器
         *  }],当前节点的子节点其他类型的
         *  bounds: Bounds，//节点位置与大小
         *  flags：Boolean//节点其他的一些标识|1、会形成层叠上下文的容器|2、位置会浮动的层叠上下文|3、需要单独处理的列表
         * }
         */
        
        // https://www.w3.org/TR/CSS2/visuren.html#propdef-z-index
        //传入解析好的renderTree，根据层叠上下文的规则构建出模拟canvas渲染的不同类型的上下文
        const stack = parseStackingContexts(element); 
        console.log(stack);
        /**
         * stack
         * 把不同的类型样式的子元素，分到不同的渠道去整合，stack也是一个树
         * {
         *  element: ElementPaint{
         *              container:ElementContainer,
         *              effects:[],
         *              curves:BoundCurves
         *          },//当前的元素的绘制配置
         *  inlineLevel:[ElementPaint],//当前层叠上下文的内联元素
         *  nonInlineLevel:[ElementPaint],当前层叠上下文的不是内联的普通元素
         *  negativeZIndex:[StackingContext],//z-index为负的上下文
         *  zeroOrAutoZIndexOrTransformedOrOpacity:[StackingContext],//z-index为0或者auto、transform或者opacity形成的层叠
         *  positiveZIndex:[StackingContext],//定位和z-index形成的层叠
         *  nonPositionedFloats:[StackingContext],//没有定位的时候的float形成的层叠
         *  nonPositionedInlineLevel:[StackingContext]//没有定位是的内联形成的层叠
         * }
         */
        await this.renderStack(stack); //渲染

        this.applyEffects([], EffectTarget.BACKGROUND_BORDERS); //清空堆栈

        return this.canvas;
    }
}

const isTextInputElement = (
    container: ElementContainer
): container is InputElementContainer | TextareaElementContainer | SelectElementContainer => {
    if (container instanceof TextareaElementContainer) {
        return true;
    } else if (container instanceof SelectElementContainer) {
        return true;
    } else if (container instanceof InputElementContainer && container.type !== RADIO && container.type !== CHECKBOX) {
        return true;
    }
    return false;
};

const calculateBackgroundCurvedPaintingArea = (clip: BACKGROUND_CLIP, curves: BoundCurves): Path[] => {
    switch (clip) {
        case BACKGROUND_CLIP.BORDER_BOX:
            return calculateBorderBoxPath(curves);
        case BACKGROUND_CLIP.CONTENT_BOX:
            return calculateContentBoxPath(curves);
        case BACKGROUND_CLIP.PADDING_BOX:
        default:
            return calculatePaddingBoxPath(curves);
    }
};

const canvasTextAlign = (textAlign: TEXT_ALIGN): CanvasTextAlign => {
    switch (textAlign) {
        case TEXT_ALIGN.CENTER:
            return 'center';
        case TEXT_ALIGN.RIGHT:
            return 'right';
        case TEXT_ALIGN.LEFT:
        default:
            return 'left';
    }
};
