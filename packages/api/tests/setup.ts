import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset } from 'jest-mock-extended'
import { DeepMockProxy } from 'jest-mock-extended/lib/cjs/Mock'

import { prismaClient } from '../src/api/db/prisma/client'
import { cleanUpDatasources } from './helpers'

// code executed before each test

// imported prisma client will be replace by a mocked instance
// jest.mock('../src/infra/db/prisma/client', () => ({
//   __esModule: true,
//   prisma: mockDeep<PrismaClient>(),
// }))

// beforeEach(() => {
//   mockReset(prismaMock)
// })

// export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
