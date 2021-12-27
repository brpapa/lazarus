Server

<!--
reference graphql+dataloader architecture (nao dar ctrl+c/ctrl+v): code ~/dev/_clones/rbaf-graphql-api
reference DDD repo architecture (nao dar ctrl+c/ctrl+v): code ~/dev/_clones/ddd-forum
  - quebrando em projetos/deploys diferentes: code ~/dev/metis/packages/_node-microservices-ddd
-->

# Directory Structure

```
├── /data                      # Generated GraphQL schema from code (source of truth)
├── /scripts                   # GraphQL schema and database scripts
├── /src                       # Source code
|   ├── /api
│   ├── /modules
│   │   ├── /<module>          # Isolated piece of code, also referred as subdomain
│   │   │   ├── /domain        # Declaration of core business logic/rules, entities, value objects and domain events
│   │   │   ├── /application   # Use cases (features) that relies on domain objects, application services, external services, domain event handlers
│   │   │   ├── /adapter       # Abstractions so that the application layer code can interact with the infra layer code without depends from it (i.e. IUserRepo, IJWTTokenService)
│   │   │   ├── /infra         # Concrete implementations of the abstractions from the adapter layer code so that they can be spun up at runtime, like controllers, routes, databases, external APIs, caches and ORMs
│   │   │   ├── /shared        # Shared code between all modules, like a global module
├── /test                      # Test helpers
```

- Repositories tem que ser burro, sem regra de negocio (sem voltar erros not found, etc, deixar isso a camada service)

# Dependency rules

## High level

- `api` depends from `modules/*`
- `modules/*` depends from `modules/shared`

## Module level

- `domain` depends from anyone
- `adapter` depends from `domain`
- `application` depends from `adapter`, `domain`
- `infra` depends from `domain`, `adapter`, `application`

# Command-Query Segregation (CQS)

A `command` should only make writes and don't return any value

- Execute commands against aggregate roots
  - Abour your associated collections:
    - If there's a invariant / business rule that needs to be protected by returning all of this elements in an associated collection under an aggregate boundary, return them all (like the genres of an artist).
    - If there's no underlying invariant / business rule to protect by returning all unbounded elements in an associated collection under an aggregate boundary, don't bother returning them all (like the comments of a post).

A `query` should only make reads without generate side effects

- Execute queries directly against repositories!

# Modules

## `user`

Responsible by users, identity & access management, authentication, authorization

## `incident`

Dispatch the following domain events

- `incident:submitted`

  - handlers should:
    - review
    - publicar midias no s3
    - notificar usuarios proximos

- `incident:opened`

  - handlers should:
    - atualizar quad tree
    - notificar usuarios que ouvem locais das proximidades
    - notificar usuarios que estao nas proximidades
    - atualizar o mapa em tempo real de todos os usuarios logados no app, mas que estao nas proximidades

- `incident:closed`

- `incident:timelineUpdated`

- `incident:newReaction`

## `notifications`

## `friendship`

Where lives frienship relations and real-time chat.

# Events timeline

When a UserCreated event in the `users` subdomain gets fired off, we subscribe and immediately issue a CreateCitizen command from the `incidents` subdomain.

| Id  | Actor      | Command           | Dispatch the domain event | Aggregate | Subdomain |
| --- | ---------- | ----------------- | ------------------------- | --------- | --------- |
| 0   | anonymous  | create-user       | user-created              |           | user      |
| 1   | system (0) | create-ciziten    | citizen-created           | citizen   | incident  |
| 2   | citizen    | create-incident   | incident-created          |           |           |
| 3   | citizen    | react-to-incident |                           |           |           |
