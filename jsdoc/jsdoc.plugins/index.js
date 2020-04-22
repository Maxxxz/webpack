exports.handlers = {
    parseBegin: function (sourcefiles) {
        // JSDoc开始加载和解析源所有文件之前
        // console.log('parseBegin', sourcefiles); // 只触发一次，返回数组
    },
    fileBegin: function (filename) {
        // JSDoc开始加载和解析源文件之前，返回单个文件
        // console.log('fileBegin', filename);
    },
    beforeParse: function (obj) {
        // filename：文件的名称。
        // source：文件的内容。
        var extraDoc = [
            '/**',
            ' * Function provided by a superclass.',
            ' * @name superFunc',
            ' * @memberof ui.mywidget',
            ' * @function',
            ' */',
        ];
        // obj.source += extraDoc.join('\n');  // 可以给源文件加header
        // console.log('beforeParse', obj.filename, obj.source);
    },
    // 每当JSDoc注释被发现,jsdocCommentFound事件就会被触发。
    // 注释可以或不与任何代码相关联。您可以在注释被处理之前使用此事件修改注释的内容。
    jsdocCommentFound: function (obj) {
        /*
            filename: 该文件的名称。
            comment：JSDoc注释的文本。
            lineno: 注释被发现的行号。
        */
    },
    // 当解析器在代码中遇到一个可能需要被文档化的标识符时，symbolFound 事件就会被触发。
    // 例如，解析器会为源文件中每个变量，函数和对象字面量触发一个symbolFound事件。
    symbolFound: function (obj) {
        /**
         * filename：该文件的名称。
            comment：与标识符相关联的任何注释文本。
            id:标识符的唯一ID。
            lineno:标识符被发现的行号。
            range:包含标识符相关联的源文件中第一个和最后一个字符的数字索引的一个数组。
            astnode：抽象语法树中标识符的节点。
            code：有关该代码的详细信息的对象。这个对象通常包含name,type, 和 node 属性。对象也可能具有value, paramnames, 或 funcscope属性，这取决于标识符。
         */
        // console.log('symbolFound', obj.filename, obj.astnode);
    },
    // 事件是最高级别的事件。新的doclet已被创建时，它就会被触发。
    // 这意味着一个JSDoc注释或标识符已被处理，并且实际传递给模板的doclet已被创建。
    newDoclet: function (e) {
        /**
         * doclet: 已被创建的新 doclet 。
            所述的doclet的属性取决于doclet表示的注释或标识符。你可能会看到一些共同的属性包括：
            comment：JSDoc注释文本，或者，如果标识符没被描述，那么该值是一个空字符串。
            meta：对象，描述doclet如何关联源文件（例如，在源文件中的位置）。
            description：被记录的标识符的说明。
            kind:被记录的标识符的种类（例如，class 或者 function）。
            name:标识符的短名称（例如，myMethod）。
            longname:全名，其中包含成员信息（例如，MyClass#myMethod）。
            memberof：该标识符所读的模块，命名空间或类（例如，MyClass），或者，如果该标识符没有父级，那么该值是一个空字符串。
            scope:标识符在其父级内的作用域范围（例如，global, static, instance,或 inner）。
            undocumented：如果标识符没有JSDoc注释，设置为true。
            defaultvalue：标识符的默认值。
            type：包含关于标识符类型详细信息的对象。
            params：包含参数列表的对象。
            tags：对象，包含JSDoc不识别的标记列表。只有当JSDoc的配置文件中allowUnknownTags设置为true时可用。
         */
        // Do something when we see a new doclet
        // e.doclet will refer to the newly created doclet
        // you can read and modify properties of that doclet if you wish
        // if (typeof e.doclet.description === 'string') {
        //     e.doclet.description = e.doclet.description.toUpperCase();
        // }
        // console.log('newDoclet', e.doclet.params)
    },
    fileComplete: function (obj) {
        /**
         * filename: 文件名称.
            source:该文件的内容.
        */
        // console.log('fileComplete', obj);
    },
    parseComplete: function (obj) {
        /**
         * sourcefiles:被解析的源代码文件的路径数组。
            doclets：doclet对象的数组。见newDoclet事件，有关每个的doclet可以包含属性的详细信息。注意：这个属性在JSDoc3.2.1及更高版本中可用。
        */
        // console.log('parseComplete', obj);
    },
};

exports.defineTags = function (dictionary) {
    // define tags here
    /*
        - defineTag(title, opts): 用于定义标签。第一个参数是标签的名称（例如，param 或 overview）。第二个参数是一个包含标签选项的对象。可以包含以下任一选项;每个选项的默认值都是false：

            - canHaveType (boolean): 如果标签文本可以包含一个类型表达式，那么设置为true（如  @param {string} name - Description 中的 {string}）。
            - canHaveName (boolean):如果标签文本可以包含一个名称，那么设置为true（如 @param {string} name - Description中的 name )。
            - isNamespace (boolean):  如果该标签是应用doclet的长名称，作为命名空间，那么设置为true。例如，@module标签应设置该选项设置为true，并在标签上使用@module myModuleName的结果为长名称 module:myModuleName。
           -  mustHaveValue (boolean): 如果该标签必须有一个值，那么设置为true（如 @name TheName中的 TheName )。
           -  mustNotHaveDescription (boolean): 如果该标签可能有一个值，但是不是必须有描述，那么设置为true（如 @tag {typeExpr} TheDescription中的 TheDescription )。
            - mustNotHaveValue (boolean):如果该标签必须没有值，那么设置为true。
            onTagged (function):当该标签被发现时，执行的回调函数。该函数传递两个参数：该doclet和该标签对象。
        - lookUp(tagName): 按名称检索标签对象。返回该标签对象，包括它的选项，如果标签没有定义，那么返回false。
        - isNamespace(tagName):如果该标签是应用doclet的长名称，作为命名空间，那么返回true。
        - normalise(tagName): 返回标签的规范名称。例如，@constant是@const标签的同义词;如果你调用normalise('const')，那么返回结果是constant字符串。
        - normalize(tagName): normalise的同义词。在JSDoc3.3.0及更高版本中可用。
    */

    // 标签的onTagged 回调可以修改doclet或标签的内容。
    // dictionary.defineTag('instance', {
    //     onTagged: function(doclet, tag) {
    //         doclet.scope = "instance";
    //     }
    // });

    // defineTag方法返回一个Tag对象，这个对象有一个synonym方法，这个方法可用于定义该标签的一个同义词。
    // 定义标签同义词
    // dictionary.defineTag('exception', { /* options for exception tag */ })
    // .synonym('throws');

    dictionary.defineTag('tryNow', {
        canHaveName: true,
        mustHaveValue: true,
        onTagged: function (doclet, tag) {
            doclet.tryNow = tag || '';
        },
    });

    dictionary.defineTag('tryNowExample', {
        canHaveName: true,
        mustHaveValue: true,
        onTagged: function (doclet, tag) {
            // console.log('doclet, tag', doclet.tryNow, tag);
            doclet.tryNowExample = doclet.tryNowExample || [];
            doclet.tryNowExample.push(tag);
        },
    });
};

// Node Visitors（节点访问者）
// 在最底层，插件作者可以通过定义一个访问的每个节点的节点访问者来处理在抽象语法树（AST）中的每个节点。
// 通过使用node-visitor插件，您可以修改注释并触发任意一段代码的解析事件。

// 插件可以通过导出一个包含visitNode 函数的 astNodeVisitor 对象来定义节点访问者，像这样：
exports.astNodeVisitor = {
    visitNode: function (node, e, parser, currentSourceName) {
        // do all sorts of crazy things here
        /**
        - node：AST的节点。 AST节点是JavaScript对象,使用由Mozilla的解析器API定义的格式。您可以使用Esprima的解析器演示，查看为您的源代码创建的AST。
        - e：事件。如果该节点是一个解析器处理，事件对象将已经被填充，在symbolFound事件上用相同的东西描述。否则，这将是空对象在其上设置各种属性。
        - parser：本JSDoc解析器实例。
        - currentSourceName：该文件的名称被解析。
    */
        // console.log('node, e, parser, currentSourceName', node)
    },
};
