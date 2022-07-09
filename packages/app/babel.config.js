module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          envName: 'APP_ENV',
          moduleName: '@env',
          path: '.env',
          allowUndefined: false,
        },
      ],
      [
        'relay',
        {
          src: './src',
          schema: '../server/graphql/schema.graphql',
          artifactDirectory: './src/__generated__',
        },
      ], // babel-plugin-relay
      // [
      //   '@tamagui/babel-plugin',
      //   {
      //     components: ['tamagui'],
      //     config: './tamagui.config.ts',
      //   },
      // ],
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
