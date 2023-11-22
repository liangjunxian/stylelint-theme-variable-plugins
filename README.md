# 简介
本插件基于stylelint,项目中如果设置了通用变量，可以通过它来实现项目中样式的文件对变量的实施情况，检测到变量中的值会提醒开发者应该调用变量，而非直接使用值。从而实现通过变量控制项目中的整体样式。

# 使用
在项目中.stylelintrc.js中，加入如下代码,建议使用.js文件，批量导入theme对象。
```
const theme = require('./src/assets/theme/default.json'); 

module.exports = {
  /** 其他代码... */
  "plugins": ["stylelint-theme-variable-plugins"],
  "rules": {
    "stylelint-check/props-variable-use": {
      "theme": theme,
    },
    /** 其他代码... */
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