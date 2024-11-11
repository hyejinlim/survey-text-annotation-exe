const CracoAlias = require('craco-alias');
module.exports = {
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'options',
        baseUrl: './src',
        aliases: {
          '~': '.',
        },
      },
    },
  ],
  babel: {
    presets: ['@emotion/babel-preset-css-prop'],
  },
};
