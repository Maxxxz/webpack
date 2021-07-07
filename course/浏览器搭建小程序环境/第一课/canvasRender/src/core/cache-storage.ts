import {FEATURES} from './features';

/**
 * 控制缓存类的声明
 */
export class CacheStorage {
    private static _caches: {[key: string]: Cache} = {}; //私有属性，所有缓存类
    private static _link?: HTMLAnchorElement; //中间元素A
    private static _origin: string = 'about:blank'; //当前控制缓存类的主域名
    private static _current: Cache | null = null; //控制缓存类当前控制的缓存
    /**
     * 创建缓存资源的对象，通过id和资源配置，返回一个资源缓存类
     * @param name 绘制截图的唯一id
     * @param options 资源配置项
     */
    static create(name: string, options: ResourceOptions): Cache {
        return (CacheStorage._caches[name] = new Cache(name, options));
    }
    /**
     * 销毁
     * @param name 对应的资源的id
     */
    static destroy(name: string): void {
        delete CacheStorage._caches[name];
    }
    //获取缓存类
    static open(name: string): Cache {
        const cache = CacheStorage._caches[name];
        if (typeof cache !== 'undefined') {
            return cache;
        }

        throw new Error(`Cache with key "${name}" not found`);
    }
    //给定一个链接，获取主域名部分
    static getOrigin(url: string): string {
        const link = CacheStorage._link;
        if (!link) {
            return 'about:blank';
        }

        link.href = url;
        link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
        return link.protocol + link.hostname + link.port;
    }
    //判断一个给定链接的主域名是否和当前窗口的主域名相同
    static isSameOrigin(src: string): boolean {
        return CacheStorage.getOrigin(src) === CacheStorage._origin;
    }
    //设置当前窗口的控制缓存对象的一些属性
    static setContext(window: Window) {
        CacheStorage._link = window.document.createElement('a'); //给_link赋值一个内存中的a标签
        CacheStorage._origin = CacheStorage.getOrigin(window.location.href); //设置当前缓存的主域名
    }
    //获取控制缓存类当前控制的缓存
    static getInstance(): Cache {
        const current = CacheStorage._current;
        if (current === null) {
            throw new Error(`No cache instance attached`);
        }
        return current;
    }
    //设置当前控制的缓存类
    static attachInstance(cache: Cache) {
        CacheStorage._current = cache;
    }
    //解绑缓存类
    static detachInstance() {
        CacheStorage._current = null;
    }
}

export interface ResourceOptions {
    imageTimeout: number;
    useCORS: boolean;
    allowTaint: boolean;
    proxy?: string;
}

//缓存对象声明
export class Cache {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly _cache: {[key: string]: Promise<any>}; //当前缓存类所有的控制缓存的资源
    private readonly _options: ResourceOptions; //资源文件配置项
    private readonly id: string; //唯一id
    //初始化
    constructor(id: string, options: ResourceOptions) {
        this.id = id;
        this._options = options;
        this._cache = {};
    }
    //添加图片缓存，返回promise
    addImage(src: string): Promise<void> {
        const result = Promise.resolve();
        if (this.has(src)) {
            //已经有对应图片链接的处理
            return result;
        }
        //判断链接是否是blob数据，判断是否可以被渲染
        if (isBlobImage(src) || isRenderable(src)) {
            this._cache[src] = this.loadImage(src); //加载资源，缓存起来
            return result; //返回promise的resolve状态
        }

        return result;
    }

    //查找某一个连接匹配的缓存，返回一个promise
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match(src: string): Promise<any> {
        return this._cache[src];
    }
    /**
     * 私有方法，加载图片资源，异步变同步async
     * @param key 图片链接
     */
    private async loadImage(key: string) {
        //判断是否跨域
        const isSameOrigin = CacheStorage.isSameOrigin(key);

        //是否可以使用跨域资源，判断图片不是内联，且支持了useCORS，并且图片的本地资源请求可以跨域,且不是同域
        const useCORS =
            !isInlineImage(key) && this._options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;

        //判断图片不是内联，并且不是同域，且跨域图片链接已设置,并且是否可以携带上cookie，并且不是跨域
        const useProxy =
            !isInlineImage(key) &&
            !isSameOrigin &&
            typeof this._options.proxy === 'string' &&
            FEATURES.SUPPORT_CORS_XHR &&
            !useCORS;
        //不是同域，又不允许跨域图片污染画布，又不是内联图片，又不是代理，也不是跨域，直接返回
        if (!isSameOrigin && this._options.allowTaint === false && !isInlineImage(key) && !useProxy && !useCORS) {
            return;
        }

        let src = key;
        if (useProxy) {
            /*代理的情况，返回一个promise，这种情况请求的地址是
            (${proxy}?url=${encodeURIComponent(src)}&responseType=${responseType})，
            请求地址和响应数据的类型，以参数的形式来发送到代理服务端，
            通过await接受连接
            */
            src = await this.proxy(src);
        }


        //范围一个promise，直到被reslove
        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img); //返回图片对象
            img.onerror = reject;
            if (isInlineBase64Image(src) || useCORS) {
                /*
                    内联base64图片或者使用跨域图片，
                    都设置图片的跨域头
                */
                img.crossOrigin = 'anonymous';
            }
            //设置图片链接
            img.src = src;
            //判断图片是否已加载完成
            if (img.complete === true) {
                setTimeout(() => resolve(img), 500);
                //延时几秒，再返回图片对象
            }
            //图片没有加载成功，在指定时间内，处理错误信息
            if (this._options.imageTimeout > 0) {
                setTimeout(
                    () => reject(`Timed out (${this._options.imageTimeout}ms) loading image`),
                    this._options.imageTimeout
                );
            }
        });
    }

    //判断缓存是否已加载过
    private has(key: string): boolean {
        return typeof this._cache[key] !== 'undefined';
    }

    //获取所有的资源列表链接
    keys(): Promise<string[]> {
        return Promise.resolve(Object.keys(this._cache));
    }
    /**
     * 代理请求
     * @param src 要请求的url
     */
    private proxy(src: string): Promise<string> {
        const proxy = this._options.proxy; //获取要代理请求的链接

        if (!proxy) {
            throw new Error('No proxy defined');
        }

        const key = src.substring(0, 256);

        return new Promise((resolve, reject) => {
            //判断响应类型是blob还是文本text
            const responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status === 200) {
                    if (responseType === 'text') {
                        //文本的情况，直接返回
                        resolve(xhr.response);
                    } else {
                        //blob的情况，需要使用fileReader
                        const reader = new FileReader();

                        //接受响应blob数据，处理成内存链接返回
                        reader.addEventListener('load', () => resolve(reader.result as string), false);
                        reader.addEventListener('error', e => reject(e), false);
                        reader.readAsDataURL(xhr.response); //读取bolb数据
                    }
                } else {
                    reject(`Failed to proxy resource ${key} with status code ${xhr.status}`);
                }
            };

            xhr.onerror = reject;
            //请求地址，直接请求代理服务器，连接使用传递参数的情况来处理
            xhr.open('GET', `${proxy}?url=${encodeURIComponent(src)}&responseType=${responseType}`);

            //定义响应类型
            if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
                xhr.responseType = responseType;
            }

            //图片加载的延迟时间
            if (this._options.imageTimeout) {
                const timeout = this._options.imageTimeout;
                xhr.timeout = timeout; //超时时间设置
                xhr.ontimeout = () => reject(`Timed out (${timeout}ms) proxying ${key}`);
            }

            xhr.send();
        });
    }
}

const INLINE_SVG = /^data:image\/svg\+xml/i;
const INLINE_BASE64 = /^data:image\/.*;base64,/i;
const INLINE_IMG = /^data:image\/.*/i;

//判断是否可以渲染，如果是svg，那么就需要支持，如果不支持，就不要是svg
const isRenderable = (src: string): boolean => FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src);

//判断是否是内联图片链接
const isInlineImage = (src: string): boolean => INLINE_IMG.test(src);

//判断是否是base64图片链接
const isInlineBase64Image = (src: string): boolean => INLINE_BASE64.test(src);

//判断是否是blob图片链接
const isBlobImage = (src: string): boolean => src.substr(0, 4) === 'blob';

//判断是否是svg图片
const isSVG = (src: string): boolean => src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src);
