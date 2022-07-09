App

# Directory Structure

```
├── /src                  # Source code
│   ├── /components       # Purely presentional components
│   │   ├── /atomics      # Basic building blocks of UI
│   │   ├── /molecules    # Groups of atoms bonded together
│   │   ├── /organisms    # Groups of molecules joined together to form a distinct section of UI
│   │   ├── /templates    # Groups of organisms
│   ├── /containers       # Logic and data aware components
│   ├── /screens          # Specific instances of templates components
```

# Development

- Find your local IP address: `ifconfig | grep inet`

- Config toggles in `src/config.ts`:

  - Set `ENABLE_CAMERA_MOCK` to true so that the Camera component to be mocked (useful while using simulator)
  - Set `ENABLE_NAVIGATION_STATE_PERSISTENCE` to true so that the current navigation state be maintained between multiple app reloads

- This is an expo project in a **managed workflow**.

  - `expo install <js-dependency>`: run yarn add and more

  - `expo start`: open the app via Expo Go (app runs over standard expo sdk runtime, with just the native dependencies listed [here](https://docs.expo.io/versions/latest/))

  - `expo run:ios`: open the app via custom Expo Go in simulator (app runs over a custom runtime, with any native dependency, more details [here](https://blog.expo.io/expo-managed-workflow-in-2021-d1c9b68aa10))

    - This command runs `expo prebuild` (similar to `expo eject`) to build the ios native directory, which is required for building. Then, it will build the native binary, then start a local dev server for interacting with Metro Bundler, and install the app on your simulator.

    - This command create a [custom development client](https://docs.expo.io/clients/introduction/) (custom expo go app), because the project has native dependencies that is not included in Expo SDK yet, like the `@react-native-mapbox-gl/maps` js dependency that has depends from native MapBox SDK.

      - Enquanto nao mudar codigo nativo que o expo sdk nao contem, nao precisa roda-lo novamente, apenas rode `expo start --dev-client`: https://docs.expo.io/clients/getting-started/#developing-your-application

  - `expo run:ios --device`: open the app via custom Expo Go in an USB-connected iPhone device

    - Expo CLI will automatically sign the device for development, install the app, and open it! Here’s a demo of signing with multiple developer profiles installed on your computer:

    - Users with a single profile will skip the prompt and go right to building.
    - All subsequent runs will read your preference from the Xcode project so you can easily switch between Xcode and Expo CLI!

    - Uses delta installs and other optimizations to make rebuilding your app on a connected device faster than ever before.

# Requirements to run locally

- `node`
- `npm`
- `watchman`
- `cocoapods`

# PS

I can not add a local npm dependency with `npm install ../shared` because this add a link from `./node_modules/@lazarus/shared` to `../shared` folder and [react native dont supports symlinks](https://stackoverflow.com/questions/44061155/react-native-npm-link-local-dependency-unable-to-resolve-module). So this dependency is added with a workarounded npm postinstall script.
