import mongoose from 'mongoose';

export const mongoConnect = async (callback ?: () => unknown) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGODB_CONNECTION, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  }
  return callback?.();
}

const withMongo = handler => async (req, res) => {
  return await mongoConnect(() => handler(req, res));
};

export default withMongo;
