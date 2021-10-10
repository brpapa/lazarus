# Server (with GraphQL and DataLoader)

<!-- ```
├── /src/                    # Source code of GraphQL Server
│   ├── /interface/          # NodeInterface (Relay) and other GraphQL Interfaces
│   ├── /modules/            # Modules (think on modules like isolated pieces of your code)
│   │   │── /mutation/       # Module mutations (add an index file to be used on MutationType)
│   │   │── /subscription/   # Module subscriptions (add an index file to be used on SubscriptionType)
│   │   │── /enum/           # Enums related to this module
``` -->

### Directory Structure

```
├── /data/                   # GraphQL generated schema from code, where lives the source of truth
├── /scripts/                # Generate GraphQL schema script
├── /src/                    # Source code of GraphQL Server
│   ├── /data/               # All data
│   ├── /domain/             # Core application logic, like entities and events
│   ├── /services/           # Business logic layer, enforcing domain rules, like validations and authorization
│   ├── /shared/             # Shared code between all layers, like a global module
│   ├── /presentation/       # How the app is exposed to out, like GraphQL or REST endpoints
├── /test/                   # Test helpers
```
