- reference graphql+dataloader architecture: code ~/dev/@clones/rbaf-graphql-api
- reference DDD repo architecture: code ~/dev/@clones/ddd-forum
- quebrando em projetos/deploys diferentes: code ~/dev/metis/packages/_node-microservices-ddd

# system design

- premissas
  - novos alertas serão criados frequentemente
  - alertas mais recentes (últimas 24 horas, últimos 7 dias) serão consultados com maior frequência
  - 5 imagens/videos por incidente
  - 1 imagem por user profile

## dados a persistir

- uber system design example:

  - Web Socket Manager stores the data in **Redis(Cache)** to store following:

    - Which user is connected to which web socket handler
    - What all users are connected to particular web socket handler

  - How can we efficiently broadcast the driver’s location to customers?

    - We can have a Push Model where the server will push the positions to all the relevant users. We can have a dedicated Notification Service that can broadcast the current location of drivers to all the interested customers.

    - We can build our Notification service on a publisher/subscriber model. When a customer opens the Uber app on their cell phone, they query the server to find nearby drivers. On the server side, before returning the list of drivers to the customer, we will subscribe the customer for all the updates from those drivers. We can maintain a list of customers (subscribers) interested in knowing the location of a driver and, whenever we have an update in DriverLocationHT for that driver, we can broadcast the current location of the driver to all subscribed customers. This way, our system makes sure that we always show the driver’s current position to the customer.

  - How will the new publishers/drivers get added for a current customer?

    - As we have proposed above, customers will be subscribed to nearby drivers when they open the Uber app for the first time, what will happen when a new driver enters the area the customer is looking at? To add a new customer/driver subscription dynamically, we need to keep track of the area the customer is watching.
    - This will make our solution complicated; how about if instead of pushing this information, clients pull it from the server?

  - How about if clients pull information about nearby drivers from the server?

    - Clients can send their current location, and the server will find all the nearby drivers from the QuadTree to return them to the client. Upon receiving this information, the client can update their screen to reflect current positions of the drivers. Clients can query every five seconds to limit the number of round trips to the server. This solution looks simpler compared to the push model described above.

  - Do we need to repartition a grid as soon as it reaches the maximum limit?

    - We can have a cushion to let each grid grow a little bigger beyond the limit before we decide to partition it. Let’s say our grids can grow/shrink an extra 10% before we partition/merge them. This should decrease the load for a grid partition or merge on high traffic grids.

- `incidents` table: (location, timestamp)

  - todo: otimizar a query: dado uma localização (do usuário) e um raio, retornar os alertas próximos (e mais recentes!)

    - construir meu proprio quadtree index em uma redis table!

      - https://medium.com/@waleoyediran/spatial-indexing-with-quadtrees-b998ae49336
      - todo: como persistir a quadtree?
      - todo: redis for geospacial indexing?

    - todo: yelp (proximity server) system design
      - https://medium.com/swlh/design-a-proximity-server-like-nearby-or-yelp-part-1-c8fe2951c534
      - https://codeburst.io/design-a-proximity-server-like-yelp-part-2-d430879203a5?source=user_profile---------2----------------------------&gi=857954fe1a4a
      - https://www.youtube.com/watch?v=TCP5iPy8xqo&ab_channel=TechDummiesNarendraL

  - todo: location db: https://www.youtube.com/watch?v=OcUKFIjhKu0&list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX&index=24&ab_channel=GauravSenGauravSen

# ddd

- done: https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-nodejs-architecture/
- done: https://khalilstemmler.com/articles/enterprise-typescript-nodejs/when-crud-mvc-isnt-enough/
- done: https://khalilstemmler.com/articles/typescript-domain-driven-design/aggregate-design-persistence/
- done: https://khalilstemmler.com/articles/graphql/ddd/schema-design/
- done: https://khalilstemmler.com/articles/typescript-domain-driven-design/one-to-many-performance/

- todo: exactly when dispatch domain events? i do it after any mutation db operation

  - todo: https://khalilstemmler.com/blogs/domain-driven-design/where-do-domain-events-get-dispatched/

- todo: https://khalilstemmler.com/articles/test-driven-development/how-to-test-code-coupled-to-apis-or-databases/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/chain-business-logic-domain-events/
- todo: https://khalilstemmler.com/articles/enterprise-typescript-nodejs/application-layer-use-cases/
- todo: https://khalilstemmler.com/articles/typescript-value-object/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/repository-dto-mapper/
- todo: https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/ddd-vs-crud-design/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/updating-aggregates-in-domain-driven-design/
- todo: https://khalilstemmler.com/articles/domain-driven-design-intro/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/domain-modeling-1/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/intention-revealing-interfaces/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/entities/
- todo: https://khalilstemmler.com/articles/enterprise-typescript-nodejs/why-event-based-systems/
- todo: https://khalilstemmler.com/blogs/domain-driven-design/transcribing-video-with-ddd-discussion/
- todo: https://khalilstemmler.com/articles/typescript-domain-driven-design/make-illegal-states-unrepresentable/

- graphql
  - todo: https://khalilstemmler.com/blogs/graphql/how-apollo-rest-data-source-caches-api-calls/
  - todo: https://khalilstemmler.com/blogs/graphql/nested-graphql-resolvers/
  - todo: https://khalilstemmler.com/articles/graphql/graphql-architectural-advantages/
    - minha pergunta foi respondida?

# notes

- microservices + events + docker: https://www.youtube.com/watch?v=sSm2dRarhPo&ab_channel=CodingTech

- gRPC usa HTTP/2 (rapido, muito usado pra comunicao entre microservicos)

- Temporal api polyfill: https://github.com/tc39/proposal-temporal/blob/main/README.md#polyfills

- entria monorepo blog posts

  - [How to implement viewerCanSee in GraphQL](https://medium.com/@sibelius/how-to-implement-viewercansee-in-graphql-78cc48de7464#.d9vpk6fvx)
  - [Testing a GraphQL Server using Jest](https://medium.com/@sibelius/testing-a-graphql-server-using-jest-4e00d0e4980e)
  - [Parallel testing a GraphQL Server with Jest](https://itnext.io/parallel-testing-a-graphql-server-with-jest-44e206f3e7d2)
  - [Encapusaling data on graphql using loaders](https://medium.com/@jonathancardoso/encapsulating-data-on-graphql-using-loaders-9387b805c4fc)
  - [How to implement viewerCanSee in GraphQL](https://medium.com/@jonathancardoso/access-control-list-on-graphql-with-loaders-b0ab1a80651d)
