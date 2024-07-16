const postcss = require('postcss');
const stylelint = require('stylelint');
const reRuleName = require('../utils/reRuleName');
const ruleMessages = require('../utils/ruleMessage');
const isColor = require('../utils/isColor');

const ruleName = reRuleName('props-variable-use');

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ruleMessages.expected,
});

const eachMessage = (values, options = {}) => {
  if (values.length > 0) {
    const msg = stylelint.utils.ruleMessages(ruleName, {
      messages: `${ruleMessages.message}${values.map((item) => `${item}: ${options.theme[item]}\n`).join('')}`,
    });
    stylelint.utils.report({
      message: msg.messages,
      node: options.node,
      result: options.result,
      ruleName,
      severity: ['error', 'warning', 'ignore'].includes(options.severity) ? options.severity : 'warning',
    });
  }
};

/**
 * theme: 变量对象
 * color-props-check: 颜色属性检查, "off" / "on"
 * size-props-check: 尺寸属性检查, "off" / "on"
 * space-props-check: 间距属性检查, "off" / "on"
 */

const plugin = postcss.plugin(ruleName, (options) => (root, result) => {
  const { theme, severity } = options;
  if (!theme) {
    return;
  }
  const colorAttr = [
    'background',
    'background-color',
    'border-color',
    'color',
    'outline-color',
    'border',
    'box-shadow',
    'text-shadow',
  ];
  const sizeAttr = [
    'font',
    'font-size',
    'line-height',
    'border-radius',
    'height',
    'width',
    'min-width',
    'max-width',
    'min-height',
    'max-height',
    'font-weight',
  ];
  const spaceAttr = [
    'margin',
    'margin-top',
    'margin-bottom',
    'margin-left',
    'margin-right',
    'padding',
    'padding-top',
    'padding-bottom',
    'padding-left',
    'padding-right',
    'gap',
    'grid-gap',
    'grid-row-gap',
    'grid-column-gap'
  ];
  let colorVars = {};
  let spaceVars = {};
  let sizeVars = {};

  Object.keys(theme).forEach(varName => {
    if (varName.includes('media')) {
      return;
    }
    if (
      varName.includes('margin') || 
      varName.includes('padding') || 
      varName.includes('space')
    ) {
      spaceVars[varName] = theme[varName];
    } else if (
      (
      varName.includes('width') ||
      varName.includes('height') ||
      varName.includes('size') || 
      varName.includes('font') ||
      varName.includes('radius')
    )
  ) {
      sizeVars[varName] = theme[varName];
    } else {
      colorVars[varName] = theme[varName];
    }
  })

  root.walkDecls((decl) => {
    const propertyName = decl.prop ? decl.prop.toLowerCase() : '';
    const propertyValue = decl.value ? decl.value.toLowerCase() : '';
    if (propertyName && propertyValue && !['@', '$'].includes(propertyValue.slice(0, 1))) {
      // 检查颜色的使用
      if (options['color-props-check'] !== 'off') {
        if (colorAttr.includes(propertyName)) {
          const values = Object.keys(colorVars).filter(
            (item) => {
              let flat = isColor(colorVars[item]);
              const isValueMatch = (colorVars[item] === propertyValue) || propertyValue.includes(colorVars[item]);
              // 如果是文字,则忽略关键字含背景相关的变量
              if (propertyName === 'color') {
                flat = !(item.includes('fill') || item.includes('background') || item.includes('bg'));
              }
              // 如果是背景,则忽略文字相关变量
              if (propertyName.includes('background')) {
                flat = !(item.includes('text') || item.includes('font') || item.includes('link'));
              }
              // 如果是投影,则查找含投影关键字及颜色的变量
              if (['box-shadow', 'text-shadow'].includes(propertyName)) {
                flat = (item.includes('shadow') || isColor(colorVars[item]));
              }
              return flat && isValueMatch;
            },
          );
          eachMessage(values, {
            node: decl,
            result,
            severity,
            theme,
          });
        }
      }
      // 检查尺寸值的使用
      if (options['size-props-check'] !== 'off') {
        if (sizeAttr.includes(propertyName)) {
          const values = Object.keys(sizeVars).filter(
            (item) => {
              const isFontSize = item.includes('font') || item.includes('article') || item.includes('heading');
              const isLineHeight = item.includes('line-height');
              const isValueMatch = sizeVars[item] === propertyValue;
              if (propertyName.includes('font')) {
                return item.includes(propertyName) && isFontSize && isValueMatch;
              }
              if (propertyName.includes('line-height')) {
                return item.includes(propertyName) && isLineHeight && isValueMatch;
              }
              return (item.includes(propertyName) || item.includes('size')) && !isFontSize && !isLineHeight && isValueMatch
            },
          );
          eachMessage(values, {
            node: decl,
            result,
            severity,
            theme,
          });
        }
      }
      if (options['space-props-check'] !== 'off') {
        if (spaceAttr.includes(propertyName)) {
          const values = Object.keys(spaceVars).filter(
            (item) => propertyValue.split(' ').includes(spaceVars[item]),
          );
          eachMessage(values, {
            node: decl,
            result,
            severity,
            theme,
          });
        }
      }
    }
  });
});

module.exports = stylelint.createPlugin(ruleName, plugin);
module.exports.ruleName = ruleName;
module.exports.messages = messages;
