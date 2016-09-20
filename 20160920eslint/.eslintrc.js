module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 7,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    // "plugins": [
    //     "react"
    // ],
    // "parser": "babel-eslint",
    // "extends": ["eslint:recommended", "plugin:react/recommended"],
    "rules": {
        "no-console": 0,
        "semi": 2,
        // react 配置
        // "react/prop-types": 0, // 检查react props的属性是否在propTypes声明

        "eqeqeq": 2
    }
};