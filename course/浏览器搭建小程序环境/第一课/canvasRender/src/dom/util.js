export const textToDoc = (htmlString) => {
    let frag = document.createRange().createContextualFragment(htmlString);
    var doc = document.implementation.createHTMLDocument();
    doc.body.appendChild(frag);
    return doc;
}


/**
 * 创建iframe容器
 * @param {*} ownerDocument 
 * @param {*} bounds 
 * @returns 
 */
export const createIFrameContainer = (ownerDocument, bounds) => {
    const cloneIframeContainer = ownerDocument.createElement('iframe');

    cloneIframeContainer.className = 'container';
    cloneIframeContainer.style.visibility = 'hidden';
    cloneIframeContainer.style.position = 'fixed';
    cloneIframeContainer.style.left = '-10000px';
    cloneIframeContainer.style.top = '0px';
    cloneIframeContainer.style.border = '0';
    cloneIframeContainer.width = bounds.width.toString();
    cloneIframeContainer.height = bounds.height.toString();
    cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
    ownerDocument.body.appendChild(cloneIframeContainer);

    return cloneIframeContainer;
};