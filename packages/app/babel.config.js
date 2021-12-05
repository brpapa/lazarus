module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'relay',
        {
          src: './src',
          schema: '../server/graphql/schema.graphql',
          artifactDirectory: './src/__generated__',
        },
      ], // babel-plugin-relay
      [
        'module-resolver',
        {
          extensions: ['.js', '.ts', '.tsx', '.json'],
          alias: {
            '~': './src',
            tests: './tests',
          },
        },
      ],
      ['react-native-reanimated/plugin'], // must be the last item in the plugins array
    ],
  }
}
