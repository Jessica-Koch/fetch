// apps/api/src/index.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { DogStatus, Placement, Gender, Size, Coat, type CreateDogWithPetfinderRequest } from '@fetch/shared';
import { createPetfinderUploadService, type UploadMethod } from './services/petfinder-upload';

const fastify = Fastify({
  logger: true
});

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Petfinder Upload Service (if credentials are provided)
const petfinderUploadService = process.env.PETFINDER_FTP_HOST && process.env.PETFINDER_FTP_USERNAME
  ? createPetfinderUploadService({
      ftp: {
        host: process.env.PETFINDER_FTP_HOST,
        username: process.env.PETFINDER_FTP_USERNAME,
        password: process.env.PETFINDER_FTP_PASSWORD || ''
      },
      scraper: {
        username: process.env.PETFINDER_USERNAME || '',
        password: process.env.PETFINDER_PASSWORD || ''
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
      petfinderEnabled: !!petfinderUploadService,
      petfinderNote: petfinderUploadService 
        ? 'Petfinder integration available via FTP upload and dashboard scraper'
        : 'Petfinder integration disabled - FTP credentials not configured'
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
    Body: CreateDogWithPetfinderRequest
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
          gender: dogData.gender as any,
          size: dogData.size as any,
          coat: dogData.coat as any,
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

      // Upload to Petfinder if requested and service is available
      if (autoUploadToPetfinder && petfinderUploadService) {
        try {
          console.log(`Auto-uploading ${dog.name} to Petfinder via ${petfinderMethod || 'scraper'}...`);
          
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
                postedToPetfinder: method === 'scraper', // Only true for successful scraper uploads
                petfinderSyncStatus: 'SYNCED',
                petfinderLastSync: new Date(),
                petfinderErrors: []
              }
            });

            petfinderResult = {
              success: true,
              method: uploadResult.method,
              message: uploadResult.message,
              petfinderId: uploadResult.petfinderId,
              manualUploadUrl: uploadResult.manualUploadUrl
            };

            reply.code(201);
            return { 
              data: updatedDog, 
              message: `Dog created successfully! ${uploadResult.message}`,
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
              warning: 'Petfinder upload failed - you can try uploading manually via the organization dashboard'
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
            message: 'Petfinder upload failed due to technical error'
          };

          // Still return success for dog creation
          reply.code(201);
          return { 
            data: dog, 
            message: 'Dog created successfully, but Petfinder upload failed',
            petfinderResult,
            warning: 'Petfinder upload failed - you can try uploading manually via the organization dashboard'
          };
        }
      }

      // Regular creation without Petfinder upload
      reply.code(201);
      if (autoUploadToPetfinder && !petfinderIntegration) {
        return { 
          data: dog, 
          message: 'Dog created successfully!',
          petfinderResult: { 
            success: false, 
            error: 'Petfinder service not configured',
            message: 'Dog created but Petfinder upload was not attempted. Please configure PETFINDER_USERNAME and PETFINDER_PASSWORD environment variables.'
          },
          warning: 'Petfinder credentials not configured'
        };
      }

      return { 
        data: dog, 
        message: 'Dog created successfully!'
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

  // Manually upload a dog to Petfinder
  fastify.post<{ 
    Params: { id: string };
    Body: { 
      method?: 'scraper' | 'manual';
    }
  }>('/api/dogs/:id/upload-to-petfinder', async (request, reply) => {
    try {
      if (!petfinderIntegration) {
        reply.code(503);
        return { 
          error: 'Petfinder service not configured',
          message: 'Please configure PETFINDER_USERNAME and PETFINDER_PASSWORD environment variables'
        };
      }

      const dog = await prisma.dog.findUnique({
        where: { id: request.params.id }
      });

      if (!dog) {
        reply.code(404);
        return { error: 'Dog not found' };
      }

      const { method = 'scraper' } = request.body;

      // Update status to syncing
      await prisma.dog.update({
        where: { id: dog.id },
        data: { petfinderSyncStatus: 'SYNCING' }
      });

      let uploadResult;
      if (method === 'scraper') {
        uploadResult = await petfinderIntegration.uploadDogViaScraper(dog);
      } else {
        uploadResult = await petfinderIntegration.generateManualUpload(dog);
      }

      if (uploadResult.success) {
        // Update database with success
        const updatedDog = await prisma.dog.update({
          where: { id: dog.id },
          data: {
            petfinderId: uploadResult.petfinderId || null,
            postedToPetfinder: method === 'scraper',
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
          petfinderId: uploadResult.petfinderId,
          manualUploadUrl: uploadResult.manualUploadUrl
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

  // Test Petfinder connection
  fastify.get('/api/petfinder/test', async (request, reply) => {
    if (!petfinderIntegration) {
      reply.code(503);
      return { 
        connected: false,
        error: 'Petfinder service not configured',
        message: 'Please configure PETFINDER_USERNAME and PETFINDER_PASSWORD environment variables'
      };
    }

    try {
      const isConnected = await petfinderIntegration.testConnection();
      return {
        connected: isConnected,
        message: isConnected 
          ? 'Successfully connected to Petfinder organization dashboard'
          : 'Failed to connect to Petfinder - check credentials'
      };
    } catch (error) {
      reply.code(500);
      return {
        connected: false,
        error: 'Connection test failed',
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
    console.log('🐕 Petfinder integration:', petfinderIntegration ? '✅ Enabled' : '❌ Disabled (missing credentials)');
    
    if (petfinderIntegration) {
      console.log('📝 Petfinder upload methods: Organization dashboard scraper');
      console.log('ℹ️  Note: Petfinder API v2 is read-only. Uploads use organization dashboard automation.');
    } else {
      console.log('⚠️  To enable Petfinder integration, set environment variables:');
      console.log('   - PETFINDER_USERNAME (your organization account username)');
      console.log('   - PETFINDER_PASSWORD (your organization account password)');
      console.log('   - PETFINDER_ORGANIZATION_ID (your organization ID)');
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();