# Screens

<p float="left">
  <img width="200" src="./docs/latex/images/lazarus-explorer-1.png"/>
  <img width="200" src="./docs/latex/images/lazarus-explorer-2.png"/>
  <img width="200" src="./docs/latex/images/lazarus-camera.png"/>
  <img width="200" src="./docs/latex/images/lazarus-incident.png"/>
  <img width="200" src="./docs/latex/images/lazarus-profile.png"/>
  <img width="200" src="./docs/latex/images/lazarus-notifications.png"/>
  <img width="200" src="./docs/latex/images/lazarus-sign-in.png"/>
  <img width="200" src="./docs/latex/images/lazarus-sign-up.png"/>
</p>

# Features

- background/foreground user location tracking
- location-based push notifications
- i18n support

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

- 1. usu??rios devem ser capazes de publicar alertas

  - upload de fotos e v??deos:

    - ?? obrigat??rio o upload de pelo menos uma m??dia
    - v??deos devem ser de curta dura????o
    - toda m??dia deve ter sido gravada no momento atual, dentro de uma margem de 1 hora
    - toda m??dia deve ter sido gravada no local em que o usu??rio est??, dentro de uma margem de 2 km

  <!-- - n??o deve ser criado se: -->
    <!-- - houverem outros alertas ativos muito pr??ximos ao do novo alerta -->
      <!-- tentativa de evitar duplica????es de alertas -->

  - o alerta criado deve assumir a localiza????o atual de quem o criou

- 2. usu??rios e an??nimos devem visualizar um mapa de alertas

  - vis??o geral dos alertas:
    <!-- - default view: alertas mais recentes (criados nas ??ltimas 24 horas) e nas proximidades -->
    <!-- - trend view: alertas ativos mais populares (com mais intera????es) de qualquer lugar -->
    - stats:
      - quantidade de usu??rios nas proximidades
      - quantidade de alertas nas proximidades

  - vis??o de um alerta espec??fico:
    - stats:
      - quantidade de usu??rio notificados
      - tempo relativo em rela????o ?? ??ltima atualiza????o do alerta
      <!-- - quantidade de rea????es -->
      <!-- - quantidade de coment??rios -->

- 3. usu??rios devem ser notificados quando alertas forem publicados nas suas proximidades por outros usu??rios

- 4. usu??rios podem interagir em qualquer alerta ativo publicado por outro usu??rio
  <!-- sem chat real-time, pois teria muitos usu??rios conectados -->

  - usu??rio qualquer pode reagir ao alerta
  - usu??rio qualquer pode adicionar um coment??rio ao alerta
  - usu??rio qualquer pode responder coment??rios de outros usu??rios
  - usu??rio qualquer podem dar upvote/downvote nos coment??rios de outros usu??rios

  <!-- - usu??rios podem reportar o alerta? -->
    <!-- se est??o em conformidade com app guidelines -->
    <!-- todo: usu??rios reportam/denunciam outros usu??rios? -->
    <!-- todo: usu??rios se auto moderam? avaliam e s??o avaliados? main moderators avaliam usuarios, e ai seu peso vale mais? -->

<!-- - 5. usu??rios podem colaborar com o cont??udo de alertas publicados por outros usu??rios e que est??o nas suas proximidades -->

  <!-- - usu??rio colaborante pode adicionar novas fotos/v??deos -->

<!-- - 6. usu??rios podem modificar seus pr??prios alertas -->

  <!-- - usu??rio criador pode "encerrar" o alerta -->
  <!-- - usu??rio criador pode remover qualquer colabora????o adicionada por outro usu??rio -->

  <!-- todo: usu??rio criador pode ajustar a localiza????o do alerta? -->
  <!--   ??rea ajust??vel dispon??vel? ex: dentro de 100 metros de dist??ncia da localica????o atual do alerta -->
  <!--   mas ai precisaria limitar tamb??m o n??mero de ajustes permitidos -->

<!-- - 7. usu??rios podem adicionar outros usu??rios como amigos -->

  <!-- - no envio da solicita????o e no aceite de uma solicita????o, o usu??rio deve ser lembrado de adicionar apenas usu??rios em que ele confia, pois estar?? compartilhando a sua localiza????o em tempo real com ele -->

<!-- - 8. usu??rios que s??o amigos podem conversar em um chat privado 1-1 em tempo real -->

<!-- - 9. usu??rios visualizam no mapa a localiza????o em tempo real de seus amigos -->

<!-- - 10. usu??rios podem cadastrar localidades para "ouvir" por alertas -->
  <!-- - exemplos: casa dele, casa da v??, local de trabalho -->

<!-- - 11. usu??rios devem podem acessar o perfil de outros usu??rios -->

  <!-- - stats: -->
  <!--   - quantidade de alertas publicados por ele -->
  <!--   - quantidade m??dia de upvotes e downvotes -->

## Non-functional requirements

- o sistema deve ser seguro

  - para atender isso:
    - cadastro deve ser ??nico por n??mero de celular, ou email
    - cadastro deve ser seguro (provedor de identidade terceiro, autentica????o em dois fatores)

- o sistema deve ser altamente dispon??vel, e em virtude disso, ?? aceit??vel uma tempor??ria inconsist??ncia

  - para atender isso:
    - usar servicos AWS que forne??am redundancia, como m??ltiplos instancias de servidores, banco de dados com replicas, storage system distribuido etc
    - [https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/scalable-available-multi-container-microservice-applications](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/scalable-available-multi-container-microservice-applications)
    - pre??o de uma event-driven architecture: eventual consistencia (enquanto evento esta no broker, dados inconsistentes)

- o sistema deve ser acess??vel globalmente

- o sistema deve ser altamente confi??vel, qualquer foto ou v??deo carregado nunca deve ser perdido

  - para atender isso:

- usu??rios devem ter uma experi??ncia no aplicativo em tempo real

- o sistema deve suportar uma alta carga de leituras com lat??ncia m??nima (busca e visualiza????o de alertas, fotos/v??deos), sendo toler??vel uma maior lat??ncia em escritas (upload de novas fotos/v??deos), pois haver?? menos carga de escrita
  - para atender isso:
    - otimizar para leitura

# Project structure visualization

![Visualization of this repository structure](./diagram.svg)
