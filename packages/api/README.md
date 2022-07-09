Server

# Directory Structure

```
├── /graphql                   # Generated GraphQL schema from code 
├── /prisma                    # Generated database Prisma schema from code
├── /scripts                   # Utility scripts at development time
├── /src                       # Source code
|   ├── /api                   # Entrypoint
│   ├── /modules
│   │   ├── /<module>          # A isolated piece of code, also referred as an subdomain
│   │   │   ├── /domain        # Declaration of core business logic/rules, like entities, value objects and domain events
│   │   │   ├── /application   # Use cases that relies on domain objects, like application services, external services, domain event handlers
│   │   │   ├── /adapter       # Abstractions so that the application layer code can interact with the infra layer code without depends from it (i.e. IUserRepo, IJWTTokenService)
│   │   │   ├── /infra         # Concrete implementations of the abstractions from the adapter layer code so that they can be spun up at runtime, like controllers, routes, databases, external APIs, caches and ORMs
│   │   │   /shared            # A global module shared between all modules
├── /test                      # Test helpers
```

# Dependency rules

## High level

- `api` depends from `modules/*`
- `modules/*` depends from `modules/shared`

## Module level

- `domain` layer depends from anyone
- `application` layer depends from `domain`
- `adapter` layer depends from `domain`, `application`
- `infra` layer depends from `domain`, `adapter`, `application`

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

Responsible by manage all incident-related operations.

## `notifications`

Responsible by send push notifications to user devices

<!-- 
# Events timeline

When a UserCreated event in the `users` subdomain gets fired off, we subscribe and immediately issue a CreateCitizen command from the `incidents` subdomain.

| Id  | Actor      | Command           | Dispatch the domain event | Aggregate | Subdomain |
| --- | ---------- | ----------------- | ------------------------- | --------- | --------- |
| 0   | anonymous  | create-user       | user-created              |           | user      |
| 1   | system (0) | create-ciziten    | citizen-created           | citizen   | incident  |
| 2   | citizen    | create-incident   | incident-created          |           |           |
| 3   | citizen    | react-to-incident |                           |           |           |

 -->
