module.exports = {
  devServer: {
    port: 4000,
  },
  baseUrl: './',
  chainWebpack: config => {
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use('json-loader')
      .loader('json-loader')
      .end()
      .use('md-loader')
      .loader('front-matter-loader')
      .end()
  },
}
