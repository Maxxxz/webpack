import { createIFrameContainer } from './util'

export class DocumentCloner {

    constructor(element) {
        this.referenceElement = element;
    }
    /**
     * 文档节点，载入浏览器，构建浏览器默认样式与用户样式融合
     * @param {*} ownerDocument 当前文档的document
     * @param {*} windowSize 对应的创建iframe窗口尺寸
     */
    toIFrame(ownerDocument, windowSize) {
        //创建基本iframe容器
        const iframe = createIFrameContainer(ownerDocument, windowSize);

        const cloneWindow = iframe.contentWindow;//iframe的内部window
        const documentClone = cloneWindow.document;// iframe的内部document
        //把要克隆的节点设置
        this.cloneElement = documentClone;
        const iframeLoad = iframeLoader(iframe).then(() => {
            return iframe;
        });
        documentClone.open();

        documentClone.open();
        documentClone.write(`${serializeDoctype(document.doctype)}<html></html>`);
       
        /**
         * 1.documentClone.adoptNode 重新设置要替换的html Element的归属空间
         * 2.replaceChild 替换有缘的html Element
         */
        documentClone.replaceChild(documentClone.adoptNode(this.referenceElement.documentElement), documentClone.documentElement);
        documentClone.close();
        return iframeLoad;
    }
}

/**
 * iframe加载器
 * @param {*} iframe 
 * @returns promise
 */
const iframeLoader = (iframe) => {
    return new Promise((resolve, reject) => {
        const cloneWindow = iframe.contentWindow;
        const documentClone = cloneWindow.document;
        cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = () => {
            cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = null;
            //ifame加载完毕
            const interval = setInterval(() => {
                if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {
                    clearInterval(interval);
                    resolve(iframe);
                }
            }, 50);
        }
    })
}


/**
 * 序列化doctype
 * @param {*} doctype 
 * @returns 
 */
const serializeDoctype = (doctype) => {
    let str = '';
    if (doctype) {
        str += '<!DOCTYPE ';
        if (doctype.name) {
            str += doctype.name;
        }

        if (doctype.internalSubset) {
            str += doctype.internalSubset;
        }

        if (doctype.publicId) {
            str += `"${doctype.publicId}"`;
        }

        if (doctype.systemId) {
            str += `"${doctype.systemId}"`;
        }

        str += '>';
    }

    return str;
};