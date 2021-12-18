import { User } from 'src/modules/user/domain/models/user'

export type AppContext = {
  viewer: User | null
}
