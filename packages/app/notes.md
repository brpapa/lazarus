# notes

- camera: can i have datetime and coord metadata?

  - https://docs.expo.dev/versions/latest/sdk/camera/

- react nativigation docs: https://reactnavigation.org/docs

  - `cd ~/dev/@clones/react-navigation/example`

- react native express

  - parei em: https://www.reactnative.express/app/persistence

- react native maps

  - https://github.com/react-native-maps/react-native-maps#rendering-a-list-of-markers-on-a-map
  - `code ~/dev/@clones/react-native-maps/example`

- https://docs.swmansion.com/react-native-reanimated/

  - v1:

    - animation values only!
    - useCode: **declare** sequencial steps to be executed **later** on native UI thread

  - v2:

    - rockeseat code-drops: https://www.youtube.com/watch?v=6uixYHh7XEc&ab_channel=Rocketseat
    - official webinar: https://www.youtube.com/watch?v=IdVnnIkNzGA&ab_channel=SoftwareMansion
    - official post: https://blog.swmansion.com/introducing-reanimated-2-752b913af8b3
    - candillon example: https://youtu.be/e5ALKoP1m-k?list=RDCMUC806fwFWpiLQV5y-qifzHnA&t=572
    - candillon - measures: https://www.youtube.com/watch?v=dOSp-VckNJU&ab_channel=WilliamCandillon
    - `cd ~/dev/@clones/react-native-reanimated/Example`

  - "transformations" unlisted playlist: https://www.youtube.com/playlist?list=PLkOyNuxGl9jxl0wmkADBH9eJPWR_58VeU

- https://docs.swmansion.com/react-native-gesture-handler/

  - expo example: https://snack.expo.dev/@adamgrzybowski/react-native-gesture-handler-demo

    - todo: fazer o exemplo "bottom sheet" na tela do incident-details
    - bottom sheet component
      - https://github.com/osdnk/react-native-reanimated-bottom-sheet
      - https://gorhom.github.io/react-native-bottom-sheet/modal

  - `cd ~/dev/@clones/react-native-gesture-handler/examples/Example`

  - "gestures" unlisted playlist: https://www.youtube.com/playlist?list=PLkOyNuxGl9jys0MAs2tV_wS70Ey_iFLA0

# relay notes

- GREAT REFERENCES
  - from relay team (ts, react): code ~/dev/@clones/relay-todo-example
  - UNDERSTAND RELAY STORE API: https://yashmahalwal.medium.com/a-deep-dive-into-the-relay-store-9388affd2c2b

- componente com usePreloadedQuery: qual dado ele precisa ja receber como query ref do pai pra que ele depois comece a renderizar seu conteudo?

- query

  - O COMPONENTE COM `usePreloadedQuery` IRA SUSPENDER DURANTE O LOADING
  - O COMPONENTE COM `useLazyLoadQuery` IRA SUSPENDER DURANTE O LOADING

  - a parent component preloaded the query (fetch the server with args) to child components start to render it after the load is completed

  - `useQueryLoader` or `loadQuery`: fetch a query for later rendering it, returns a query ref
  - `usePreloadedQuery`: returns the data that was already fetched to be rendered
    - the component is a query renderer
  - `useLazyLoadQuery`: fetch data during the render (not recommended)

  - fragment name: {FILE_NAME}\*{PROP_NAME}
  - a root query should include child fragments (and each child fragment can access the query variables)

- mutation
  - when a mutation response is received, any objects in the mutation response with `id` fields that match records in the local store will automatically be updated with the new field values from the response.
  - any local data updates caused by a mutation will automatically cause components subscribed to the data to be notified of the change and re-render

# tamagui

- components reference: https://github.com/tamagui/tamagui/tree/master/packages/tamagui/src/views

# ordered todo list

- todo: map view com refresh a cada map view resize (sem perder o que estava carregado enquanto recarrega novos)

  - https://sandny.com/2021/06/26/how-to-optimize-react-native-map-views/
  - https://github.com/react-native-maps/react-native-maps/issues/369#issuecomment-340334468
  - https://github.com/react-native-maps/react-native-maps/issues/369#issuecomment-340334468

- todo: build a secure realtime chat app
  - source code: https://github.com/Savinvadim1312/SignalClone
  - tutorial video: https://www.youtube.com/watch?v=_eFad7AGWdM&ab_channel=VadimSavin

- todo: websockets + react do jeito certo:
  https://dev.to/itays123/using-websockets-with-react-js-the-right-way-no-library-needed-15d0?ck_subscriber_id=887883674

- todo: social login:

  - https://www.youtube.com/watch?v=7K9kDrtc4S8
  - https://www.youtube.com/watch?v=pAt91MWwwvg

- todo: ring component over user in map: https://www.youtube.com/watch?v=VlfWXham3LE&ab_channel=CodeDaily

- todo: 'paginated slider' para navegar pelos amigos no mapa

  - https://www.youtube.com/playlist?list=PLQWFhX-gwJbkETb0lfml7W8VvZb-Hc8oK

- todo: clustered markers for better performance

  - adapt this lib to your case: https://github.com/venits/react-native-map-clustering
  - or see this too: https://github.com/novalabio/react-native-maps-super-cluster

- todo: chat app with RN and websocket: https://app.pluralsight.com/library/courses/building-chat-application-react-native/table-of-contents

- todo: building design system in react native: https://iremkaraoglu.medium.com/building-design-system-in-react-native-80fa97d9fd89

# notes

- design

  - [curated colors](https://www.happyhues.co/)
  - [icons](https://feathericons.com/)
  - [radix icons](https://icons.modulz.app)

- ["can it be done in RN?" series](https://www.youtube.com/playlist?list=PLkOyNuxGl9jxB_ARphTDoOWf5AE1J-x1r)

- [native (to both platforms) core components](https://reactnative.dev/docs/components-and-apis)

- [how to build a native module (objective-c/java code that calls native APIs), then this native module can be invoked via js](https://reactnative.dev/docs/native-modules-intro)

- [finding third-party libs](https://reactnative.dev/docs/libraries#finding-libraries)

  - [RN Directory](https://reactnative.directory/):

    - if a library is not compatible with the managed workflow (no 'Expo Go' tag), you may want to eject to the bare workflow. More in: https://docs.expo.io/introduction/managed-vs-bare/

  - [Packages included inside Expo SDK](https://docs.expo.io/versions/latest/)

  - [Awesome RN](https://github.com/jondot/awesome-react-native)

# depois

- https://medium.com/@jonathan2457/location-triggered-notifications-on-ios-24033919fb9a
- https://www.mindk.com/blog/build-a-geolocation-app/

