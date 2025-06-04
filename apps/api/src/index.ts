// apps/api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { DogStatus, Placement, Gender, Size, Coat, type CreateDogRequest } from '@fetch/shared';
import { createPetfinderAPI } from './services/petfinder';

const fastify = Fastify({
  logger: true
});

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Petfinder API (if credentials are provided)
const petfinderAPI = process.env.PETFINDER_API_KEY && process.env.PETFINDER_SECRET
  ? createPetfinderAPI(process.env.PETFINDER_API_KEY, process.env.PETFINDER_SECRET)
  : null;

const ORGANIZATION_ID = process.env.PETFINDER_ORGANIZATION_ID || 'YOUR_ORG_ID';

// Build server with all plugins and routes
const buildServer = async () => {
  // Register plugins
  await fastify.register(cors, {
    origin: ['http://localhost:3000'], // React dev server
    credentials: true
  });

  // Routes
  fastify.get('/api/health', async () => {
    return { 
      status: 'ok', 
      message: 'Fetch API is running!',
      petfinderEnabled: !!petfinderAPI
    };
  });

  // Get all dogs
  fastify.get('/api/dogs', async () => {
    const dogs = await prisma.dog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { data: dogs };
  });

  // Create a new dog
  fastify.post<{ Body: CreateDogRequest }>('/api/dogs', async (request, reply) => {
    try {
      const dogData = request.body;

      const dog = await prisma.dog.create({
        data: {
          name: dogData.name,
          breed: dogData.breed,
          breedSecondary: dogData.breedSecondary,
          breedMixed: dogData.breedMixed || false,
          breedUnknown: dogData.breedUnknown || false,
          age: dogData.age,
          weight: dogData.weight,
          description: dogData.description,
          gender: dogData.gender,
          size: dogData.size,
          coat: dogData.coat,
          colorPrimary: dogData.colorPrimary,
          colorSecondary: dogData.colorSecondary,
          colorTertiary: dogData.colorTertiary,
          status: DogStatus.AVAILABLE,
          placement: Placement.IN_FOSTER,
          spayedNeutered: dogData.spayedNeutered || false,
          houseTrained: dogData.houseTrained || false,
          specialNeeds: dogData.specialNeeds || false,
          shotsCurrent: dogData.shotsCurrent || false,
          goodWithChildren: dogData.goodWithChildren,
          goodWithDogs: dogData.goodWithDogs,
          goodWithCats: dogData.goodWithCats,
          photos: dogData.photos || [],
          videos: dogData.videos || [],
          tags: dogData.tags || [],
          contactEmail: dogData.contactEmail,
          contactPhone: dogData.contactPhone,
        }
      });

      reply.code(201);
      return { data: dog, message: 'Dog created successfully!' };
    } catch (error) {
      console.error('Error creating dog:', error);
      reply.code(500);
      return { 
        error: 'Failed to create dog', 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // Post dog to Petfinder
  fastify.post<{ Params: { id: string } }>('/api/dogs/:id/post-to-petfinder', async (request, reply) => {
    try {
      if (!petfinderAPI) {
        reply.code(400);
        return { error: 'Petfinder API not configured' };
      }

      const dog = await prisma.dog.findUnique({
        where: { id: request.params.id }
      });

      if (!dog) {
        reply.code(404);
        return { error: 'Dog not found' };
      }

      if (dog.petfinderId) {
        reply.code(400);
        return { error: 'Dog already posted to Petfinder' };
      }

      // Post to Petfinder
      const petfinderResult = await petfinderAPI.postAnimal(dog, ORGANIZATION_ID);

      // Update our database with Petfinder ID
      const updatedDog = await prisma.dog.update({
        where: { id: dog.id },
        data: {
          petfinderId: petfinderResult.id,
          postedToPetfinder: true,
        }
      });

      return { 
        data: updatedDog, 
        message: 'Dog successfully posted to Petfinder!',
        petfinderId: petfinderResult.id
      };
    } catch (error) {
      console.error('Error posting to Petfinder:', error);
      reply.code(500);
      return { 
        error: 'Failed to post to Petfinder', 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  // Get a specific dog
  fastify.get<{ Params: { id: string } }>('/api/dogs/:id', async (request, reply) => {
    try {
      const dog = await prisma.dog.findUnique({
        where: { id: request.params.id }
      });

      if (!dog) {
        reply.code(404);
        return { error: 'Dog not found' };
      }

      return { data: dog };
    } catch (error) {
      console.error('Error fetching dog:', error);
      reply.code(500);
      return { error: 'Failed to fetch dog' };
    }
  });

  return fastify;
};

// Start server
const start = async () => {
  try {
    const server = await buildServer();
    await server.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 Fetch API server running on http://localhost:3001');
    console.log('🐕 Petfinder integration:', petfinderAPI ? '✅ Enabled' : '❌ Disabled (missing credentials)');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();