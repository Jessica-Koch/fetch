// apps/api/src/services/mongodb.service.ts
import { MongoClient, Db, Collection } from 'mongodb';
import { AdoptionApplication } from '../models/application.model';

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectToMongoDB = async (): Promise<Db> => {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    db = client.db(
      process.env.MONGODB_ADOPTION_DATABASE_NAME ||
        'fetch_adoption_applications'
    );

    // Create indexes
    const applications = db.collection<AdoptionApplication>('applications');
    await applications.createIndex({ adopterId: 1 });
    await applications.createIndex({ dogIds: 1 });
    await applications.createIndex({ status: 1 });
    await applications.createIndex({ submittedAt: -1 });

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

export const getApplicationsCollection = async (): Promise<
  Collection<AdoptionApplication>
> => {
  const database = await connectToMongoDB();
  return database.collection<AdoptionApplication>('applications');
};

export const closeMongoDBConnection = async (): Promise<void> => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  process.exit(0);
});
