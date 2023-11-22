const postcss = require('postcss');
const stylelint = require('stylelint');
const reRuleName = require('../utils/reRuleName');
const ruleMessages = require('../utils/ruleMessage');

const ruleName = reRuleName('properties-variable-check');

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ruleMessages.expected,
});

/**
 * theme: 变量对象
 * color-properties-check: 颜色属性检查, "off" / "on"
 * size-properties-check: 尺寸属性检查, "off" / "on"
 * space-properties-check: 间距属性检查, "off" / "on"
 */

const plugin = postcss.plugin(ruleName, (options = {
  theme: null,
  'color-properties-check': 'on',
  'size-properties-check': 'on',
  'space-properties-check': 'on',
}) => (root, result) => {
  const { theme } = options;
  if (!theme) {
    return;
  }

  root.walkDecls((decl) => {
    const propertyName = decl.prop ? decl.prop.toLowerCase() : '';
    const propertyValue = decl.value ? decl.value.toLowerCase() : '';
    if (propertyName && propertyValue) {
      // 检查颜色的使用
      if (options['color-properties-check'] === 'on') {
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
            (item) => (theme[item] === propertyValue) || propertyValue.includes(theme[item]),
          );
          if (values.length > 0) {
            const msg = stylelint.utils.ruleMessages(ruleName, {
              messages: `${ruleMessages.message}${values.map((item) => `${item}: ${theme[item]}\n`).join('')}`,
            });
            stylelint.utils.report({
              message: msg.messages,
              node: decl,
              result,
              ruleName,
            });
          }
        }
      }
      // 检查尺寸值的使用
      if (options['size-properties-check'] === 'on') {
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
            && ((theme[item] === propertyValue) || propertyValue.includes(theme[item])),
          );
          if (values.length > 0) {
            const msg = stylelint.utils.ruleMessages(ruleName, {
              messages: `${ruleMessages.message}${values.map((item) => `${item}: ${theme[item]}\n`).join('')}`,
            });
            stylelint.utils.report({
              message: msg.messages,
              node: decl,
              result,
              ruleName,
            });
          }
        }
      }
      if (options['space-properties-check'] === 'on') {
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
            (item) => (theme[item] === propertyValue) || propertyValue.includes(theme[item]),
          );
          if (values.length > 0) {
            const msg = stylelint.utils.ruleMessages(ruleName, {
              messages: `${ruleMessages.message}${values.map((item) => `${item}: ${theme[item]}\n`).join('')}`,
            });
            stylelint.utils.report({
              message: msg.messages,
              node: decl,
              result,
              ruleName,
            });
          }
        }
      }
    }
  });
});

module.exports = stylelint.createPlugin(ruleName, plugin);
module.exports.ruleName = ruleName;
module.exports.messages = messages;
