module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'prismjs',
      {
        languages: ['javascript', 'css', 'markup', 'java', 'python'],
        // plugins: ['toolbar', 'show-language', 'line-highlight'],
        css: true,
      },
    ],
  ],
}
