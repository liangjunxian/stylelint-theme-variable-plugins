const postcss = require('postcss');
const stylelint = require('stylelint');
const ruleMessages = require('./ruleMessage');

const createPlugin = (ruleName, attr = []) => {
  if (ruleName && attr.length > 0) {
    const plugin = postcss.plugin(ruleName, (options) => (root, result) => {
      const { theme } = options;
      if (!theme) {
        return;
      }
      root.walkDecls((decl) => {
        const propertyName = decl.prop ? decl.prop.toLowerCase() : '';
        const propertyValue = decl.value ? decl.value.toLowerCase() : '';
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
        if (propertyName && propertyValue && colorAttr.includes(propertyName)) {
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
      });
    });
    return plugin;
  }
  return null;
};

module.exports = createPlugin;
