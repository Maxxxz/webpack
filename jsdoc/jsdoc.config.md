[配置参考手册](https://www.html.cn/doc/jsdoc/about-configuring-jsdoc.html)
```
{
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "source": {
        "includePattern": ".+\\.js(doc)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "plugins": [],
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    }
}
```
参数说明
- JSDoc允许您使用无法识别的标签（tags.allowUnknownTags）;
- 这两个标准JSDoc标签和closure标签被启用（tags.dictionaries）;
- 只有以.js和.jsdoc结尾的文件将会被处理（source.includePattern）;
- 任何文件以下划线开始或开始下划线的目录都将被忽略（source.excludePattern）;
- 无插件加载（plugins）;
- @link标签呈现在纯文本（templates.cleverLinks，templates.monospaceLinks）。