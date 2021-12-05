Metis

# Requirements

## Functional requirements (e os use cases que ele contem)

- 1. usuários devem ser capazes de publicar alertas  

  - upload de fotos e vídeos:
    - é obrigatório o upload de pelo menos uma mídia
    - vídeos devem ser de curta duração
    - toda mídia deve ter sido gravada no momento atual, dentro de uma margem de 1 hora
    - toda mídia deve ter sido gravada no local em que o usuário está, dentro de uma margem de 2 km

  - não deve ser criado se:
    - houverem outros alertas ativos muito próximos ao do novo alerta
      <!-- tentativa de evitar duplicações de alertas -->
  
  - o alerta criado deve assumir a localização atual de quem o criou

- 2. usuários e anônimos devem visualizar um mapa de alertas

  - visão geral dos alertas: 
    - default view: alertas mais recentes (criados nas últimas 24 horas) e nas proximidades
    - trend view: alertas ativos mais populares (com mais interações) de qualquer lugar
    - stats:
      - quantidade de usuários nas proximidades

  - visão de um alerta específico:
    - stats:
      - quantidade de usuário notificados
      - tempo relativo em relação à última atualização do alerta
      - quantidade de reações
      - quantidade de comentários

- 3. usuários devem ser notificados quando alertas forem publicados nas suas proximidades por outros usuários

- 4. usuários podem interagir em qualquer alerta ativo publicado por outro usuário
  <!-- sem chat real-time, pois teria muitos usuários conectados -->
  - usuário qualquer pode reagir ao alerta
  - usuário qualquer pode adicionar um comentário ao alerta
  - usuário qualquer pode responder comentários de outros usuários
  - usuário qualquer podem dar upvote/downvote nos comentários de outros usuários

  <!-- - usuários podem reportar o alerta? -->
    <!-- se estão em conformidade com app guidelines -->
    <!-- todo: usuários reportam/denunciam outros usuários? -->
    <!-- todo: usuários se auto moderam? avaliam e são avaliados? main moderators avaliam usuarios, e ai seu peso vale mais? -->

- 5. usuários podem colaborar com o contéudo de alertas reativos publicados por outros usuários e que estão nas suas proximidades

  - usuário colaborante pode adicionar novas fotos/vídeos
  
- 6. usuários podem modificar seus próprios alertas

  - usuário criador pode "encerrar" o alerta
  - usuário criador pode remover qualquer colaboração adicionada por outro usuário

  <!-- todo: usuário criador pode ajustar a localização do alerta? -->
    <!-- área ajustável disponível? ex: dentro de 100 metros de distância da localicação atual do alerta -->
    <!-- mas ai precisaria limitar também o número de ajustes permitidos -->

- 7. usuários podem adicionar outros usuários como amigos

  - no envio da solicitação e no aceite de uma solicitação, o usuário deve ser lembrado de adicionar apenas usuários em que ele confia, pois estará compartilhando a sua localização em tempo real com ele

- 8. usuários que são amigos podem conversar em um chat privado 1-1 em tempo real

- 9. usuários visualizam no mapa a localização em tempo real de seus amigos

- 10. usuários podem cadastrar localidades para "ouvir" por alertas
  <!-- - exemplos: casa dele, casa da vó, local de trabalho -->

- 11. usuários devem podem acessar o perfil de outros usuários

  - stats:
    - quantidade de alertas publicados por ele
    - quantidade média de upvotes e downvotes

## Non-functional requirements

- o sistema deve ser seguro

  - para atender isso:
    - cadastro deve ser único por número de celular, ou email
    - cadastro deve ser seguro (provedor de identidade terceiro, autenticação em dois fatores)

- o sistema deve ser altamente disponível, e em virtude disso, é aceitável uma temporária inconsistência

  - para atender isso:
    - usar servicos AWS que forneçam redundancia, como múltiplos instancias de servidores, banco de dados com replicas, storage system distribuido etc
    - [https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/scalable-available-multi-container-microservice-applications](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/scalable-available-multi-container-microservice-applications)
    - preço de uma event-driven architecture: eventual consistencia (enquanto evento esta no broker, dados inconsistentes)

- o sistema deve ser acessível globalmente

- o sistema deve ser altamente confiável, qualquer foto ou vídeo carregado nunca deve ser perdido

  - para atender isso:

- usuários devem ter uma experiência no aplicativo em tempo real

- o sistema deve suportar uma alta carga de leituras com latência mínima (busca e visualização de alertas, fotos/vídeos), sendo tolerável uma maior latência em escritas (upload de novas fotos/vídeos), pois haverá menos carga de escrita
  - para atender isso:
    - otimizar para leitura


# Features checklist


- media (images/records)

  - [x] upload on-demand to file storage
  - [x] download on-demand

- real-time updates

  - all active/logged app users keep a connection open with the server (websocket with GraphQL Subscription) to receive updates about

    - [ ] progresso de upload de arquivos
    - [ ] novo alerta criado na proximidade
    - [ ] nova interação em alertas ativos na proximidade
    - [ ] quantidade de usuarios nos arredores (não necessariamente logados)
    - [?] chat 1-1
      <!-- https://www.youtube.com/watch?v=E3NHd-PkLrQ -->
      <!-- https://dev.to/dsckiitdev/build-a-chat-app-with-graphql-subscriptions-typescript-part-2-3k35 -->

    - servidor envia atualizacoes somente para os `relevant users` (que estao nos arredos) logados
      - todo: como o servidor envia apenas pros usuários relevantes?
      - todo: como conectar usuarios proximos no mesmo websocket handler? group message?
      - híbrido?
        - divide o mapa em chunks
        - o usuario pode estar em mais de uma ainda, e ai filtra no app se está no raio

  - user location tracking
    - [ ] near real-time user location updates, only between a friendship group of users
      <!-- https://www.infoworld.com/article/3128306/build-geospatial-apps-with-redis.html -->
        <!-- https://github.com/RedisLabs/geo.lua#location-updates -->
          <!-- When you combine this geospatial support with other Redis capabilities, some interesting functionality becomes extremely simple to implement. For example, by melding the new Geo Sets and PubSub, it is nearly trivial to set up a real-time tracking system in which every update to a member’s position is sent to all interested parties (think of a running or biking group where you want to track group members locations in real time). -->

# Tech stack

- javascript (language)
- typescript (type system)
- node (backend runtime)
- koa (server framework)
- graphql (API)
- vscode (IDE)
- react (declarative UI)
- react-native (native apps)
- recoil ("global" state management)
- ws + graphql-ws (for websockets)
- relay (declarative data fetching)
- redis (cache, queue management, pubsub)
- jest (test framework)
- supertest (HTTP tests)
- prettier (code formatting)
- prisma (ORM)
- github actions (CI/CD)

<!-- - mongoose (mongo schema) -->
<!-- - bulljs (event driven distributed jobs) -->
<!-- - webpack (bundling server and frontend apps) -->
<!-- - rollup (bundling for packages and libraries) -->
<!-- - babel (enable modern syntax and plugins) -->
<!-- - jscodeshift (codemod) -->
<!-- - openapi (API REST documentation) -->
<!-- - docusuarus (documentation) -->
<!-- - eslint (lint rules) -->
<!-- - hygen (codegen) -->
<!-- - styled-components (css in js) -->
<!-- - storybook (design system and email builder) -->
<!-- - testing library (testing dom) -->
<!-- - material-ui (ui base components) -->
<!-- - styled-system (functional css) -->
<!-- - react-router (routing) -->
<!-- - nivo + d3 (for charts) -->
<!-- - react-table (table management) -->
<!-- - draftjs (richtext) -->
<!-- - formik (forms) -->
<!-- - fastlane (android/ios deploy automation) -->

# Project structure visualization

![Visualization of this repository structure](./diagram.svg)


