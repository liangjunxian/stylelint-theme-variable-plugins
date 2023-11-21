const reRuleName = (name) => {
  const prefix = 'theme-check';
  if (name && typeof name === 'string') {
    return `${prefix}/${name}`;
  }
  return '';
};

module.exports = reRuleName;
