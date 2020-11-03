const path = require('path')

module.exports = ({ config }) => {
  config.resolve.extensions.push(
    '.ts',
    '.tsx',
    '.vue',
    '.css',
    '.scss',
    '.html'
  )

  config.module.rules.push({
    test: /\.ts$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
      },
    ],
  })
  config.module.rules.push({
    test: /\.s(a|c)ss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
  })
  config.resolve.alias = {
    vue: 'vue/dist/vue.esm.js',
    '@': path.resolve(__dirname, '../src'),
    '~': path.resolve(__dirname, '../src'),
  }

  return config
}
