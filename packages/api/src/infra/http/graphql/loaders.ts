import { IncidentLoader } from 'src/modules/incident/application/loaders/incident-loader'
import { incidentRepo } from 'src/modules/incident/infra/db/repositories'

/**
 * DataLoader is a pattern to optimize graphql requests, like these that contains a circular reference and require the same data multiple times, for example (user -> article -> comments -> writtenByUser (can be the same that wrote the article)). The idea is that resolver calls are batched and thus the data source (database or external APIs) only has to be hit once, avoiding round-trips.
 *
 * DataLoader will coalesce all individual loads which occur within a single frame of execution (a single tick of the event loop) and then call the batch loading function with all the requested keys
 */

// GraphQL resolvers runs async (concurrently) and are atomic (each one is unawareness from other, don't know about the query as a whole)

// the load function of a DataLoader instance:
// imediatally add the key to an eventual batch later and so returns a promise (result data async)
// is a memoized function (in -memory only), that is, after the load is called given a key, the result is cached to avoid redundant loads on later

// to enable per-request caching/batching, a new instance of each DataLoader class should be created for each request

// todo: after a mutation, clear the related cached key
/*
  // And a value happens to be loaded (and cached).
  const user = await userLoader.load(4) 
  
  // A mutation occurs, invalidating what might be in cache.
  await sqlRun('UPDATE users WHERE id=4 SET username="zuck"') 
  userLoader.clear(4)
  
  // Later the value load is loaded again so the mutated data appears.
  const user = await userLoader.load(4)
*/

// todo: filtered 'find all' queries nao precisam de data loader, ou teria que gerar um hash dado os filtros para ser a data loader key

export const createLoaders = (_dbClient?: any) => ({
  incident: IncidentLoader.createDataLoader(incidentRepo),
})

export type DataLoaders = ReturnType<typeof createLoaders>
