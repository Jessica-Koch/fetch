// apps/api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { DogStatus, Placement, Gender, Size, Coat, type CreateDogRequest } from '@fetch/shared';
import { createPetfinderUploadService, type UploadMethod } from './services/petfinder-upload';

const fastify = Fastify({
  logger: true
});

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Petfinder Upload Service (if credentials are provided)
const petfinderUploadService = process.env.PETFINDER_API_KEY && process.env.PETFINDER_SECRET
  ? createPetfinderUploadService({
      ftp: {
        host: process.env.PETFINDER_FTP_HOST || '',
        username: process.env.PETFINDER_FTP_USERNAME || '',
        password: process.env.PETFINDER_FTP_PASSWORD || ''
      },
      scraper: {
        username: process.env.PETFINDER_API_KEY,
        password: process.env.PETFINDER_SECRET
      },
      organizationId: process.env.PETFINDER_ORGANIZATION_ID || 'YOUR_ORG_ID',
      defaultMethod: 'auto'
    })
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
      petfinderEnabled: !!petfinderUploadService
    };
  });

  // Get all dogs
  fastify.get('/api/dogs', async () => {
    const dogs = await prisma.dog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { data: dogs };
  });

  // Create a new dog (with optional Petfinder upload)
  fastify.post<{ 
    Body: CreateDogRequest & { 
      autoUploadToPetfinder?: boolean;
      petfinderMethod?: 'ftp' | 'scraper' | 'auto';
      useFallback?: boolean;
    } 
  }>('/api/dogs', async (request, reply) => {
    try {
      const { autoUploadToPetfinder, petfinderMethod, useFallback, ...dogData } = request.body;

      // Create dog in database first
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
          gender: dogData.gender as any, // Convert to Prisma enum
          size: dogData.size as any,     // Convert to Prisma enum
          coat: dogData.coat as any,     // Convert to Prisma enum
          colorPrimary: dogData.colorPrimary,
          colorSecondary: dogData.colorSecondary,
          colorTertiary: dogData.colorTertiary,
          status: DogStatus.AVAILABLE as any,
          placement: Placement.IN_FOSTER as any,
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
          // Set initial Petfinder sync status
          petfinderSyncStatus: autoUploadToPetfinder ? 'SYNCING' : 'NOT_SYNCED',
          petfinderErrors: []
        }
      });

      let petfinderResult = null;

      // Upload to Petfinder if requested
      if (autoUploadToPetfinder && petfinderUploadService) {
        try {
          console.log(`Auto-uploading ${dog.name} to Petfinder...`);
          
          const method = petfinderMethod || 'auto';
          const shouldUseFallback = useFallback !== false; // Default to true

          // Upload with chosen method
          const uploadResult = shouldUseFallback 
            ? await petfinderUploadService.uploadDogWithFallback(dog)
            : await petfinderUploadService.uploadDog(dog, method);

          if (uploadResult.success) {
            // Update database with success
            const updatedDog = await prisma.dog.update({
              where: { id: dog.id },
              data: {
                petfinderId: uploadResult.petfinderId || null,
                postedToPetfinder: true,
                petfinderSyncStatus: 'SYNCED',
                petfinderLastSync: new Date(),
                petfinderErrors: []
              }
            });

            petfinderResult = {
              success: true,
              method: uploadResult.method,
              message: uploadResult.message,
              petfinderId: uploadResult.petfinderId
            };

            reply.code(201);
            return { 
              data: updatedDog, 
              message: `Dog created and uploaded to Petfinder via ${uploadResult.method}!`,
              petfinderResult
            };
          } else {
            // Update database with error
            await prisma.dog.update({
              where: { id: dog.id },
              data: {
                petfinderSyncStatus: 'ERROR',
                petfinderErrors: [uploadResult.error || 'Unknown error']
              }
            });

            petfinderResult = {
              success: false,
              error: uploadResult.error,
              message: uploadResult.message
            };

            // Still return success for dog creation, but note Petfinder failure
            reply.code(201);
            return { 
              data: dog, 
              message: 'Dog created successfully, but Petfinder upload failed',
              petfinderResult,
              warning: 'Petfinder upload failed - you can try uploading manually later'
            };
          }
        } catch (petfinderError) {
          console.error('Petfinder upload error:', petfinderError);
          
          // Update database with error
          await prisma.dog.update({
            where: { id: dog.id },
            data: {
              petfinderSyncStatus: 'ERROR',
              petfinderErrors: [petfinderError instanceof Error ? petfinderError.message : 'Unknown error']
            }
          });

          petfinderResult = {
            success: false,
            error: petfinderError instanceof Error ? petfinderError.message : 'Unknown error',
            message: 'Petfinder upload failed'
          };

          // Still return success for dog creation
          reply.code(201);
          return { 
            data: dog, 
            message: 'Dog created successfully, but Petfinder upload failed',
            petfinderResult,
            warning: 'Petfinder upload failed - you can try uploading manually later'
          };
        }
      }

      // Regular creation without Petfinder upload
      reply.code(201);
      return { 
        data: dog, 
        message: 'Dog created successfully!',
        petfinderResult: autoUploadToPetfinder ? { 
          success: false, 
          error: 'Petfinder service not configured',
          message: 'Dog created but Petfinder upload was not attempted'
        } : null
      };
    } catch (error) {
      console.error('Error creating dog:', error);
      reply.code(500);
      return { 
        error: 'Failed to create dog', 
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

  // Add endpoint to manually upload a dog to Petfinder
  fastify.post<{ 
    Params: { id: string };
    Body: { 
      method?: 'ftp' | 'scraper' | 'auto';
      useFallback?: boolean;
    }
  }>('/api/dogs/:id/upload-to-petfinder', async (request, reply) => {
    try {
      if (!petfinderUploadService) {
        reply.code(503);
        return { 
          error: 'Petfinder service not configured',
          message: 'Please configure Petfinder API credentials'
        };
      }

      const dog = await prisma.dog.findUnique({
        where: { id: request.params.id }
      });

      if (!dog) {
        reply.code(404);
        return { error: 'Dog not found' };
      }

      const { method = 'auto', useFallback = true } = request.body;

      // Update status to syncing
      await prisma.dog.update({
        where: { id: dog.id },
        data: { petfinderSyncStatus: 'SYNCING' }
      });

      const uploadResult = useFallback 
        ? await petfinderUploadService.uploadDogWithFallback(dog)
        : await petfinderUploadService.uploadDog(dog, method);

      if (uploadResult.success) {
        // Update database with success
        const updatedDog = await prisma.dog.update({
          where: { id: dog.id },
          data: {
            petfinderId: uploadResult.petfinderId || null,
            postedToPetfinder: true,
            petfinderSyncStatus: 'SYNCED',
            petfinderLastSync: new Date(),
            petfinderErrors: []
          }
        });

        return {
          success: true,
          data: updatedDog,
          method: uploadResult.method,
          message: uploadResult.message,
          petfinderId: uploadResult.petfinderId
        };
      } else {
        // Update database with error
        await prisma.dog.update({
          where: { id: dog.id },
          data: {
            petfinderSyncStatus: 'ERROR',
            petfinderErrors: [uploadResult.error || 'Unknown error']
          }
        });

        reply.code(400);
        return {
          success: false,
          error: uploadResult.error,
          message: uploadResult.message
        };
      }
    } catch (error) {
      console.error('Error uploading to Petfinder:', error);
      
      // Update database with error
      await prisma.dog.update({
        where: { id: request.params.id },
        data: {
          petfinderSyncStatus: 'ERROR',
          petfinderErrors: [error instanceof Error ? error.message : 'Unknown error']
        }
      });

      reply.code(500);
      return { 
        success: false,
        error: 'Failed to upload to Petfinder', 
        message: error instanceof Error ? error.message : 'Unknown error'
      };
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
    console.log('🐕 Petfinder integration:', petfinderUploadService ? '✅ Enabled' : '❌ Disabled (missing credentials)');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();