module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended'],
  rules: {
    // Disable rules that conflict with Prettier
    'block-closing-brace-newline-after': null,
    'block-closing-brace-space-before': null,
    'block-opening-brace-newline-after': null,
    'block-opening-brace-space-after': null,
    'block-opening-brace-space-before': null,
    'declaration-block-semicolon-newline-after': null,
    'declaration-block-semicolon-space-before': null,
    'declaration-block-trailing-semicolon': null,
    indentation: null,
    'max-empty-lines': null,
  },
};
