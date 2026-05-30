import mongoose from 'mongoose';

// Conectar ao MongoDB usando Mongoose

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  // Permitir que o cache seja armazenado globalmente para evitar múltiplas conexões
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI não definido no .env.local');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
