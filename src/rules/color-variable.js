const stylelint = require('stylelint');
const createPlugin = require('../utils/createPlugin');
const reRuleName = require('../utils/reRuleName');
const ruleMessages = require('../utils/ruleMessage');

const ruleName = reRuleName('color-variable');

const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: ruleMessages.expected,
});

const plugin = createPlugin(
  ruleName,
  [
    'background',
    'background-color',
    'border-color',
    'color',
    'outline-color',
    'border',
    'box-shadow',
    'text-shadow',
  ],
);

module.exports = stylelint.createPlugin(ruleName, plugin);
module.exports.ruleName = ruleName;
module.exports.messages = messages;
