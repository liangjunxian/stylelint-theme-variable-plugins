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

  root.walkDecls((decl) => {
    const propertyName = decl.prop ? decl.prop.toLowerCase() : '';
    const propertyValue = decl.value ? decl.value.toLowerCase() : '';
    if (propertyName && propertyValue) {
      // 检查颜色的使用
      if (options['color-props-check'] !== 'off') {
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
        if (colorAttr.includes(propertyName)) {
          const values = Object.keys(theme).filter(
            (item) => {
              let flat = isColor(theme[item]);
              // 如果是文字,则忽略关键字含背景相关的变量
              if (propertyName === 'color') {
                flat = !(item.includes('fill') || item.includes('background') || item.includes('bg'));
              }
              // 如果是投影,则查找含投影关键字及颜色的变量
              if (['box-shadow', 'text-shadow'].includes(propertyName)) {
                flat = (item.includes('shadow') || isColor(theme[item]));
              }
              return flat
                && ((theme[item] === propertyValue) || propertyValue.includes(theme[item]));
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
        if (sizeAttr.includes(propertyName)) {
          const values = Object.keys(theme).filter(
            (item) => item.includes(propertyName)
              && !(item.includes('margin') || item.includes('padding') || item.includes('space'))
              && (theme[item] === propertyValue),
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
        ];
        if (spaceAttr.includes(propertyName)) {
          const values = Object.keys(theme).filter(
            (item) => (item.includes('margin') || item.includes('padding') || item.includes('space'))
              && (theme[item] === propertyValue),
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
