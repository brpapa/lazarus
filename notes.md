- v1 design (app reference: code ~/dev/@clones/lexicon/frontend | https://docs.lexicon.is)

# Backlog

- to-do (priority)

  - git commit -m '[api] change to interested users and consider each user preference: EnrichIncidentWithNearbyUsersObserver`

  - git commit -m '[api] add updateDistanceRadius mutation'
  - git commit -m '[app] integrate with updateDistanceRadius mutation'

  - git commit -m '[app] add MyIncidents screen in Profile' (view incident, delete)

  - git commit -m '[app][api] add logout mutation (when user logout remove user devices that are listening for push notifications)'
  - git commit -m '[app] fix report flow that is not being able to discard previous medias when back to camera'
  - git commit -m '[app] refactor local storage interaction' (example: code ~/dev/@clones/lexicon/frontend/src/helpers/localStorage.tsx)
  - git commit -m '[app] moves color scheme to recoil atom with local storage sync'

  - git commit -m '[app] add IncidentComments screen'
    - add reply action to incident at bottom (on click go to modal too)
    - new NotificationType: 'user replied to your incident'

  - git commit -m '[app] add User screen' (listing your last activities)
    - list last activities (link in incident detail screen)

  - git commit -m '[app] IncidentComments screen: add reply action to each comment'
  - git commit -m '[app] IncidentComments screen: add reply action to each reply'
  - git commit -m '[app] IncidentComments screen: add upvote/downvote action to each comment'

- to-do (not priority):

  - git commit -m '[app] bump react navigation to v6 to use grouped screens' (RootStackNavigator and MainStackNavigator at same level: https://reactnavigation.org/docs/group/)
  - git commit -m '[app] migrate from v1 components/theme to v2 with tamagui'
  - git commit -m '[api] add pino logger'
  - git commit -m '[shared] add common types'
  - git commit -m '[app] bump relay to v13.0.0.0 (with rust compiler)'
  - git commit -m '[api] bump graphql-js to v16.0.0'
  - git commit -m '[api] adopt nexus to get declarative and code-first graphql schema' (https://nexusjs.org)
  - git commit -m '[api/app] refactor to graphql upload'
    - https://github.com/jaydenseric/graphql-upload
    - multipart request over graphql (this use busboy under the hood)
  - git commit -m '[api/app] add option to change language in Preferences screen'
    - needs to persist on db, because of the push notifications messages

  - deploy api to EC2? (because ec2 can access elasticache if is in the same vpc)
    - example terraform + ec2 + docker: https://fsgeorgee.medium.com/growing-out-of-heroku-to-terraform-docker-and-aws-69e66df4132d
    - ways to access elasticache from outside aws: 
      - (ssh)(for development) https://github.dev/hashicorp/terraform-elasticache-example
      - (vpn) https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/accessing-elasticache.html#access-from-outside-aws
  
  - deploy app to app stores?
    - EAS: https://blog.expo.dev/introducing-eas-395d4809cc6f
    - set up Expo Android app to get push notifications using your own Firebase Cloud Messagign (FCM) credentials: https://docs.expo.dev/push-notifications/using-fcm
    - expo: read the [permissions on iOS](https://docs.expo.dev/guides/permissions/#ios) and [permissions on Android](https://docs.expo.dev/guides/permissions/#android) sections carefully before deploying your app to stores
    - https://youtu.be/_wDCFCnxMrU?t=1763
    - android app
      - setup google maps api key: https://docs.expo.io/versions/latest/sdk/map-view/
      - publish android app: https://proandroiddev.com/what-to-expect-when-converting-an-ios-app-to-an-android-app-on-react-native-c519fba7f287

    - consigo instalar custom expo go no meu iPhone de graca? só com EAS build cloud service, esperar por ele chegar na free tier!
      - ad-hoc distribuition ($99/year ou $299/year)
        - needs provide a before-hand list of UDID devices who will use the app
      - enterprise distribution ($299/year)
      - test flight (paid too)

- would be nice:
  - location module? (the unique that can interact with redis geoset)
    - @user: user not returns location
    - @incident: incident returns location if duplicates location between pg and redis
  - user friendships, friends map view with (with real-time updates?)
  - user-user chat
  - incidents fetching filtering within screen
  - reputation system, user editing your owned incidents

# Legacy

- real-time updates

  - https://mattkrick.medium.com/graphql-after-4-years-scaling-subscriptions-d6ea1a8987be

  - all active app users keep a connection open with the server (websocket with GraphQL Subscription) to receive updates about

    - [ ] progresso de upload de arquivos
    - [ ] novo alerta criado na proximidade
    - [ ] nova interação em alertas ativos na proximidade
    - [ ] quantidade de usuarios nos arredores (não necessariamente logados)
    - [?] chat 1-1
      <!-- https://www.youtube.com/watch?v=E3NHd-PkLrQ -->
      <!-- https://dev.to/dsckiitdev/build-a-chat-app-with-graphql-subscriptions-typescript-part-2-3k35 -->

  - user location tracking
    - [ ] near real-time user location updates, only between a friendship group of users
      <!-- https://www.infoworld.com/article/3128306/build-geospatial-apps-with-redis.html -->
        <!-- https://github.com/RedisLabs/geo.lua#location-updates -->
          <!-- When you combine this geospatial support with other Redis capabilities, some interesting functionality becomes extremely simple to implement. For example, by melding the new Geo Sets and PubSub, it is nearly trivial to set up a real-time tracking system in which every update to a member’s position is sent to all interested parties (think of a running or biking group where you want to track group members locations in real time). -->


- lint-staged in a monorepo: https://github.com/okonet/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo
  - husky precisa ficar no projeto raiz
  ```
  "pre-commit": "lint-staged",
  "lint-staged": {
    "*.js": [
      "prettier --write --config \".prettierrc\"",
      "yarn jest:lint --passWithNoTests",
      "git add"
    ],
    "*.{ts,tsx}": [
      "prettier --write --config \".prettierrc\"",
      "eslint --fix",
      "git add"
    ],
    "*.yml": [
      "prettier --write",
      "git add"
    ]
  },
  ```

- configurar git hook pre-push para rodar tests antes do push
  - https://benmccormick.org/2017/02/26/running-jest-tests-before-each-git-commit/

- CD:
  - reference: https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions
  - github-hosted runner: https://docs.github.com/en/actions/reference/specifications-for-github-hosted-runners#supported-software
  - se o valor for secreto: echo "::add-mask::My sensitive value"
  - gh actions deploy sam: https://github.com/aws-samples/aws-sam-github-actions-example
