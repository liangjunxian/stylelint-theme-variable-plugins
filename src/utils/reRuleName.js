const reRuleName = (name) => {
  const prefix = 'stylelint-check';
  if (name && typeof name === 'string') {
    return `${prefix}/${name}`;
  }
  return '';
};

module.exports = reRuleName;
