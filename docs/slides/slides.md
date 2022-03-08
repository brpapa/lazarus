---
theme: apple-basic # https://github.com/slidevjs/themes/tree/main/packages/theme-apple-basic
colorSchema: 'light'
titleTemplate: '%s'
highlighter: prism # https://sli.dev/custom/highlighters.html
lineNumbers: false # show line numbers in code blocks
drawings:
  persist: false # persist drawings in exports and build
layout: intro
---

# Lazarus

Aplicativo para publicação e acompanhamento de alertas de segurança pública

<div class="absolute bottom-10">
  <span class="font-700">Bruno José Papa</span>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/brpapa/lazarus" target="_blank" alt="GitHub" class="text-xl icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---

# Introdução
 
## Conceito

- **Alerta** = qualquer acontecimento que pode colocar em risco a segurança das pessoas, como, por exemplo, catástrofes naturais, acidentes, incêndios, assaltos, tiroteios, protestos não pacíficos, e ruas interditadas.

## Problema

- Pouca propagação de informações de alertas.
- Distância entre a mídia e pequenas comunidades locais. 
- Tempo de resposta alto dos chamados emergenciais.

<!-- 
  - Pessoas se comunicam sobre alertas individualmente, não há um espaço onde elas todas podem se contribuir
  - Pequenos acontecimentos próximos a voce (mas importantes) não são divulgados na mídia, e quando sao, talvez vc queria saber antes
-->

---

# Solução

- Uma plataforma:
  - que conecte e empodere comunidades locais
  - que seja orgânica
  - onde usuários possam reportar alertas com imagens e vídeos
  - onde usuários são notificados de alertas próximos

- Benefícios aos usuários:
  - consciência dos perigos dos arredores
  - podem buscar se proteger e proteger uns aos outros

<!-- 
  - imagens/videos para que outros possam verificar/confirmar o que está sendo reportando.
  - sabendo dos alertas ela pode pensar duas vezes antes de sair de casa
-->
  

---
layout: section
---

# Sistema

---

# Componentes físicos

<img class="pt-5" src="/system.png"/>

---

# Tecnologias

<div class="grid grid-cols-4 gap-5 mt-12 mx-30">
  <img class="w-30" src="/node.png"/>
  <img class="w-25" src="/react-native.jpeg"/>
  <img class="w-30" src="/expo.png"/>
  <img class="w-20" src="/graphql.png"/>
  <img class="w-35" src="/relay.png"/>
  <img class="w-25" src="/postgresql.png"/>
  <img class="w-35" src="/prisma.png"/>
  <img class="w-20" src="/redis.png"/>
  <img class="w-20" src="/docker.png"/>
  <img class="w-35" src="/aws.png"/>
  <img class="w-25" src="/heroku.jpeg"/>
  <img class="w-20" src="/terraform.png"/>
</div>

---
layout: section
---

# Servidor

---

# Visão geral

<img class="pt-5" src="/system_server.png"/>

---

# Camadas de um módulo

<img class="h-md mx-auto p-2" src="/system_server_each-module_layers.png"/>

<!-- 
  - arquitetura em camadas: melhor manutenção e evolução do código

  - Domain layer: que está menos propensa a mudar
  
  - Application layer: casos de uso, as principais funcionalidades. CQS pois operacoes que mudam o sistema (e geram efeitos colaterais) são separadas daquelas que apenas leem dados para deixar o código mais simples

  - Adapter layer: contém abstrações para que a application layer possa interagir com a infrastructure layer sem depender dela, habilitando o que é chamado de inversão de dependência.

  - Infrastructure layer: camada mais propensa a mudar, contém detalhes (bancos especifos, lógica de apresentacao (GraphQL ou endpoints))
 -->

---

# Entradas e saídas de cada módulo

<img class="h-md mx-auto p-5" src="/system_server_all_modules_commands-observers-events.png"/>

<!-- Faltam as consulta no diagrama  -->
---

# Diagrama de classes da camada de domínio

<div class="grid grid-cols-2 gap-10 mt-10">

<img class="mt-10" src="/system_server_shared-module_domain.png"/>

<img class="h-sm" src="/system_server_all-modules_domain-entities.png"/>

</div>

<!-- 
  - DomainEvents: singleton usado para para armazenar o estado de quais observers estão interessados em ouvir pelos eventos emitidos por determinados aggregate roots. 

    - As instâncias dos aggregate roots inscritos contém domain events que serão dispachados para seus observers quando a camada de infraestrutura persistir as alterações feitas.

  - Observers sao instanciados assim que o servidor é iniciado, e o metodo é invocado subscribeObserver.
 -->

---

# Busca por usuários relevantes

<div class="grid grid-cols-[300px,1fr] gap-10 pt-4 -mb-6">

- **Redis GeoSet**:
  - chave: `USER_LOCATIONS`
  - valor: lista de pares de `member` e `location` (member = userId)

- **Redis GeoSearch**: O(N+log(M)), onde N é o número de elementos fora do círculo e M é o número de elementos dentro do círculo


```ts {all|5-6|8-13|15-16|18-21}
class UserRepo extends PrismaRepo<User> implements IUserRepo {
  ...

  async findAllLocatedWithinCircle(
    centerPoint: { latitude: number; longitude: number },
    radiusInMeters: number,
  ): Promise<UserWithinCircle[]> {
    const pairs = await this.redisClient.geoSearchWith(
      this.REDIS_GEO_SET_KEY,
      centerPoint,
      { radius: radiusInMeters, unit: 'm' },
      [GeoReplyWith.COORDINATES, GeoReplyWith.DISTANCE],
    )

    const usersId = pairs.map((v) => v.member)
    const orderedUsers = await this.findByIdBatchOrdered(usersId)

    return zip(orderedUsers, pairs).map(([user, pair]) => ({
      user: UserMapper.fromModelToDomain(user, pair.coordinates),
      distanteToCenterInMeters: Number(pair.distance),
    }))
  }
}
```

</div>

---
layout: section
---

# Aplicativo

---

# GraphQL schema


<div class="grid grid-cols-2 gap-2">

```graphql
type Query {
  node(id: ID!): Node
  me: Me
  incident(incidentId: String!): Incident
  incidents(
    after: String, 
    first: Int, 
    before: String, 
    last: Int, 
    filter: IncidentsFilterInputType
  ): IncidentConnection!
  notification(notificationId: String!): Notification
}

type Mutation {
  ...
}

type Subscription {
  ...
}
```

```graphql
interface Node {
  id: ID!
}

type Incident implements Node {
  id: ID!
  incidentId: String!
  title: String!
  location: Location!
  formattedAddress: String
  medias: [Media!]!
  usersNotifiedCount: Int!
  ownerUser: User!
  createdAt: Date!
}

type Location {
  latitude: Float!
  longitude: Float!
}
...

```

<!-- code-first vs. schema-first, escolhi code-first  -->

</div>

<!-- Node type: Based on Relay specs, enable clients to handling caching and data refetching for any GraphQL type that implements the Node Interface -->

---

# Exemplo de uma GraphQL query

<div class="grid grid-cols-2 gap-2 -m-t-2">

Requisição:

Resposta:

```graphql
POST http://localhost:5555/graphql
Content-Type: application/json

query Q {
  incident(
    incidentId: "2c02a7e7-3b92-4509-9dab-549e278f8406"
  ) {
    id
    incidentId
    title
    location {
      latitude
      longitude
    }
    createdAt
  }
}
```

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 684
X-Response-Time: 18ms

{
  "data": {
    "incident": {
      "id": "SW5jaWRlbnQ6ZjBmODA2OWMtNjUwZi00ODAzLWEwNjMtNTg0Y2ZiNDBiZjE5",
      "incidentId": "f0f8069c-650f-4803-a063-584cfb40bf19",
      "title": "Alerta 7",
      "location": {
        "latitude": -22.824899161486105,
        "longitude": -48.44813793897629
      },
      "createdAt": "2022-03-01T19:27:55.226Z"
    }
  }
}
```

<!-- 
  - GraphQL reduz overhead de rede, cliente requisita e recebe apenas o que quer
 -->

</div>
---

# Busca de dados com Relay

<img class="h-md mx-auto pb-5" src="/system_app.png"/>

<!-- <img class="w-20" src="/react-relay-graphql.png"/> -->

<!--
 - relay conecta a visualizacao (react components) com os dados (graphql server ) 
 - relay store é uma especie de cache que armazena um grafo com todos os dados já trazidos
 -->
---

# Fluxo de inicialização

<img class="pt-5" src="/system_app_initialization-flow.png"/>

---

# Demonstração

<video class="mx-auto" width="250" controls>
  <source src="demo.mp4" type="video/mp4">
</video>

---
layout: center
class: text-center
---

# Obrigado

[Github](https://github.com/brpapa/lazarus)
