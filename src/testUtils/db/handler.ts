import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

export const mongoServer = new MongoMemoryServer()

export const dbConnect = async () => {
  await mongoServer.start()
}

export const dbDrop = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase()
  }
}

export const dbDisconnect = async () => {
  await mongoose.connection.close()
  await mongoServer.stop()
}
