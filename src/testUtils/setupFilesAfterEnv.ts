import { dbConnect, dbDrop, dbDisconnect } from './db/handler'

beforeAll(async () => {
  await dbConnect()
})

afterEach(async () => {
  jest.clearAllMocks()
  await dbDrop()
})

afterAll(async () => {
  await dbDisconnect()
  jest.resetAllMocks()
})
