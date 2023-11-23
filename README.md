# 简介
本插件基于stylelint,项目中如果设置了通用变量，可以通过它来实现项目中样式的文件对变量的实施情况，检测到变量中的值会提醒开发者应该调用变量，而非直接使用值。从而实现通过变量控制项目中的整体样式。

# 安装

## npm安装
```
npm i stylelint stylelint-theme-variable-plugins -D
```

## yarn安装
```
yarn add stylelint stylelint-theme-variable-plugins -D
```

# 使用
在项目根目录中新建.stylelintrc.js文件，并加入如下代码。 
其中theme为你项目中的样式变量，一般应该是less或sass，由于插件只能接收对象，所以这里建议通过脚本生成less或sass及json文件使变量内容能对应上。

```
const theme = require('./src/assets/theme/default.json');

module.exports = {
  "ignoreFiles": ["src/assets/less/**/*.less"],
  "plugins": ["stylelint-theme-variable-plugins"],
  "extends": "stylelint-theme-variable-plugins/config",
  "rules": {
    "stylelint-check/props-variable-use": {
      "theme": theme,
    },
  }
}


```
## 参数
| 参数 | 数据类型 | 说明 | 默认值 |  必填  | 例子 |
|---|---|---|---|---|---|
| theme | object | 变量的键值对对象 |  null | 是 | { primary: '#1890ff' }  |
| color-props-check | string('off \| on') | 是否开启颜色属性检查 |  'on' | 否 |  
| size-props-check | string('off \| on')  | 是否开启尺寸属性检查 |  'on' | 否 |
| space-props-check | string('off \| on')  | 是否开启间距属性检查 |  'on' | 否 |
| severity | string('error' \| 'warning' \| 'ignore')  | 发现问题后的状态 |  'warning' | 否 |


# 使用命令行检测单个文件
## 1. 全局安装styelint
```
npm i stylelint -g
```
## 2. 执行命令
```
stylelint path/to/your.less --formatter unix
```