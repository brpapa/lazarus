# Tech stack

- javascript: language
- typescript: type system for type checking and better code quality
- graphql: API
- vscode: IDE
- ws + graphql-ws: for websockets
- redis: cache, queue management, pubsub
- prettier: code formatting
- github actions: CI/CD
- eslint: lint rules
- i18next: internationalization
- terraform: infrastructure as code tool
- docker: to run containers locally

- server-only:
  - node: backend runtime
  - koa: server framework
  - prisma: database ORM
  - jest: test framework
  - supertest: HTTP tests

- app-only:
  - react: declarative ui
  - react native: framework for building native apps with react
  - expo: runtime and SDK for better development experience
  - relay: declarative graphql data fetching in react
  - recoil: global state management
  - react navigation: library for navigation
  - react-hook-form: forms
  - babel: enable modern syntax and plugins

# Development

See instrucions for [api](./packages/api/README.md) and [app](./packages/app/README.md).

Set credentials of Google Cloud Platform, AWS and Heroku.

<!-- ## Codebase definitions

Relevant users: users that are located nearby to one incident
User session: an auth token life cycle (access token & refresh token) -->

# System overview

![system](./docs/diagrams/out/system.png)
<!-- heroku redis free plan is not persistent (restart = data losing), 20 max concurrent connections only -->

## Infrastructure

All infrastructure components are defined inside [terraform](./terraform) folder using the [Terraform](https://www.terraform.io) IaC tool.

- Before do anything, define a `terraform/secrets.tfvars` file with your secrets:

  ```
  heroku_email = "your_heroku_email"
  heroku_api_key = "your_heroku_api_key"
  aws_profile = "your_aws_profile"
  aws_access_key = "your_aws_access_key"
  aws_secret_key = "your_aws_secret_key"
  pg_root_username = "your_pg_root_username"
  pg_root_password = "your_pg_root_password"
  ```

Inside `./terraform` folder, you can run the commands:
  - `terraform init`: initialize terraform configuration and install plugins.
  - `terraform fmt`: format *.tf files
  - `terraform validate`: validate *.tf files
  - `terraform plan -var-file="secrets.tfvars"`: preview the changes that will be done on providers to match current configuration.
  - `terraform apply -var-file="secrets.tfvars"`: make the planned changes on providers.
  - `terraform destroy -var-file="secrets.tfvars"`: clean up the resources created on providers.

After apply new changes, run inside `./terraform`:
  - change redis config to not kill idle connections after 300 seconds (default): `heroku redis:timeout --app lazarus-node-api --seconds=0`
  - init pg tables: `(cd ../packages/api && dotenv -e env.prod -- npx prisma db push)`

Links:
- [Terraform Heroku provider documentation](https://registry.terraform.io/providers/heroku/heroku/latest/docs)
- [Terraform AWS provider documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)

## Code deploy

At the moment, every new code is deployed manually.

### Server

1. If you are not logged to your Heroku account yet: `heroku auth:login -i`

2. Go to right folder, build and push image to Heroku Registry, and deploy the image built: `(cd ./packages/api && heroku container:push web --app lazarus-node-api --context-path .. && heroku container:release web --app lazarus-node-api)`

- To view production logs: `heroku logs --app lazarus-node-api --tail`
- To restart application: `heroku restart --app lazarus-node-api`

### Mobile app

The app can be deployed to Expo hosting as a [preview release](https://docs.expo.dev/guides/sharing-preview-releases). But this works only for Android and not for iOS due to Apple restrictions, more details [here](https://docs.expo.dev/workflow/publishing/#on-ios-you-cant-share-your-published).

- Create a project in your [Expo account](https://expo.dev)

- Run `APP_ENV='prod' expo publish --clear`
  - https://docs.expo.dev/classic/building-standalone-apps/
  - https://docs.expo.dev/build/setup/

- Accessed in: https://expo.dev/@lazarus/app

# Requirements

## Functional requirements 

- 1. usuários devem ser capazes de publicar alertas

  - upload de fotos e vídeos:

    - é obrigatório o upload de pelo menos uma mídia
    - vídeos devem ser de curta duração
    - toda mídia deve ter sido gravada no momento atual, dentro de uma margem de 1 hora
    - toda mídia deve ter sido gravada no local em que o usuário está, dentro de uma margem de 2 km

  <!-- - não deve ser criado se: -->
    <!-- - houverem outros alertas ativos muito próximos ao do novo alerta -->
      <!-- tentativa de evitar duplicações de alertas -->

  - o alerta criado deve assumir a localização atual de quem o criou

- 2. usuários e anônimos devem visualizar um mapa de alertas

  - visão geral dos alertas:
    <!-- - default view: alertas mais recentes (criados nas últimas 24 horas) e nas proximidades -->
    <!-- - trend view: alertas ativos mais populares (com mais interações) de qualquer lugar -->
    - stats:
      - quantidade de usuários nas proximidades
      - quantidade de alertas nas proximidades

  - visão de um alerta específico:
    - stats:
      - quantidade de usuário notificados
      - tempo relativo em relação à última atualização do alerta
      <!-- - quantidade de reações -->
      <!-- - quantidade de comentários -->

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

<!-- - 5. usuários podem colaborar com o contéudo de alertas publicados por outros usuários e que estão nas suas proximidades -->

  <!-- - usuário colaborante pode adicionar novas fotos/vídeos -->

<!-- - 6. usuários podem modificar seus próprios alertas -->

  <!-- - usuário criador pode "encerrar" o alerta -->
  <!-- - usuário criador pode remover qualquer colaboração adicionada por outro usuário -->

  <!-- todo: usuário criador pode ajustar a localização do alerta? -->
  <!--   área ajustável disponível? ex: dentro de 100 metros de distância da localicação atual do alerta -->
  <!--   mas ai precisaria limitar também o número de ajustes permitidos -->

<!-- - 7. usuários podem adicionar outros usuários como amigos -->

  <!-- - no envio da solicitação e no aceite de uma solicitação, o usuário deve ser lembrado de adicionar apenas usuários em que ele confia, pois estará compartilhando a sua localização em tempo real com ele -->

<!-- - 8. usuários que são amigos podem conversar em um chat privado 1-1 em tempo real -->

<!-- - 9. usuários visualizam no mapa a localização em tempo real de seus amigos -->

<!-- - 10. usuários podem cadastrar localidades para "ouvir" por alertas -->
  <!-- - exemplos: casa dele, casa da vó, local de trabalho -->

<!-- - 11. usuários devem podem acessar o perfil de outros usuários -->

  <!-- - stats: -->
  <!--   - quantidade de alertas publicados por ele -->
  <!--   - quantidade média de upvotes e downvotes -->

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


# Project structure visualization

![Visualization of this repository structure](./diagram.svg)
