module.exports = {
  presets: ['@vue/app'],
  plugins: [
    [
      'prismjs',
      {
        languages: [
          'javascript',
          'jsx',
          'tsx',
          'json',
          'yaml',
          'http',
          'css',
          'scss',
          'markup',
          'java',
          'python',
          'bash',
          'c',
          'sql',
          'properties',
        ],
        // plugins: ['toolbar', 'show-language', 'line-highlight'],
        css: true,
      },
    ],
  ],
}
