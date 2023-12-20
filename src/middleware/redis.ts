import { createClient } from 'redis'

export const client = async () => {
  const client = createClient({ url: process.env.REDIS_CONNECTION })

  client.on('error', err => console.error('Redis Client Error', err))

  await client.connect()

  return client
}

export const publishMessage = async (channel: string, message: string) => {
  const publisher = await client()

  await publisher.publish(channel, message)

  await publisher.quit()
}

export const subscribe = async (channel: string, context: Context) => {
  const subscriber = await client()

  await subscriber.pSubscribe(channel, (message: string) => {
    context.websocket.send(message)
  })

  context.websocket.on('close', async function () {
    await subscriber.pUnsubscribe(channel)
    await subscriber.quit()
  })
}
