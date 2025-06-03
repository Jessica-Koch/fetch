// apps/api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { CreateDogRequest, DogStatus, Placement } from '@fetch/shared';

const fastify = Fastify({
  logger: true
});

// Initialize Prisma
const prisma = new PrismaClient();

// Register plugins
await fastify.register(cors, {
  origin: ['http://localhost:3000'], // React dev server
  credentials: true
});

fastify.get('/api/health', async (request, reply) => {
    return { status: 'ok', message: 'Fetch API is running!' };
}
);

// Get all dogs
fastify.get('/api/dogs', async () => {
    const dogs = await prisma.dog.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return { data: dogs };
});

// Create a new dog
fastify.post<{ Body: CreateDogRequest }>('/api/dogs', async (request, reply) => {
    try {
      const { name, breed, age, weight, description, photos = [] } = request.body;
  
      const dog = await prisma.dog.create({
        data: {
          name,
          breed,
          age,
          weight,
          description,
          photos,
          status: DogStatus.AVAILABLE,
          placement: Placement.IN_FOSTER
        }
      });
  
      reply.code(201);
      return { data: dog, message: 'Dog created successfully!' };
    } catch (error) {
      reply.code(500);
      return { error: 'Failed to create dog', message: error instanceof Error ? error.message : 'Unknown error' };
    }
});
  
// Get a dog by ID
fastify.get<{ Params: { id: string } }>('/api/dogs/:id', async (request, reply) => {
  try {
    const dog = await prisma.dog.findUnique({
      where: { id: request.params.id },
    });
     
    if (!dog) {
      reply.code(404);
      return { error: 'Dog not found' };
    }

    return { data: dog };
  } catch (error) {
    reply.code(500);
    return { error: 'Failed to fetch dog', message: error instanceof Error ? error.message : 'Unknown error' };
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Fetch API server running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start()