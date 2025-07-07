import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import {
  DogStatus,
  Placement,
  Gender,
  Size,
  Coat,
  type CreateDogWithPetfinderRequest,
} from '@fetch/shared';
import { createPetfinderUploadService } from './services/petfinder-upload';
import { createPetfinderImporter } from './services/petfinder-importer';

const fastify = Fastify({
  logger: true,
});

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize Petfinder Upload Service (if FTP credentials are provided)
const petfinderUploadService =
  process.env.PETFINDER_FTP_HOST && process.env.PETFINDER_FTP_USERNAME
    ? createPetfinderUploadService({
        ftp: {
          host: process.env.PETFINDER_FTP_HOST,
          username: process.env.PETFINDER_FTP_USERNAME,
          password: process.env.PETFINDER_FTP_PASSWORD || '',
        },
        organizationId: process.env.PETFINDER_ORGANIZATION_ID || 'YOUR_ORG_ID',
        defaultMethod: 'ftp',
      })
    : null;

const ORGANIZATION_ID = process.env.PETFINDER_ORGANIZATION_ID || 'YOUR_ORG_ID';

// Initialize Petfinder importer (if credentials are provided)
const petfinderImporter =
  process.env.PETFINDER_API_KEY && process.env.PETFINDER_SECRET
    ? createPetfinderImporter(
        {
          clientId: process.env.PETFINDER_API_KEY,
          clientSecret: process.env.PETFINDER_SECRET,
        },
        prisma
      )
    : null;

// Build server with plugins and routes
type Server = typeof fastify;
const buildServer = async (): Promise<Server> => {
  // Register CORS
  await fastify.register(cors, {
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  // Health check
  fastify.get('/api/health', async () => ({
    status: 'ok',
    message: 'Fetch API is running!',
    petfinderEnabled: !!petfinderUploadService,
    petfinderNote: petfinderUploadService
      ? 'Petfinder integration available via FTP upload'
      : 'Petfinder integration disabled - FTP credentials not configured',
  }));

  // Get all dogs
  fastify.get('/api/dogs', async () => {
    const dogs = await prisma.dog.findMany({ orderBy: { createdAt: 'desc' } });
    return { data: dogs };
  });

  // Create a new dog (with optional Petfinder FTP upload)
  fastify.post<{
    Body: CreateDogWithPetfinderRequest;
  }>('/api/dogs', async (request, reply) => {
    try {
      const { autoUploadToPetfinder, ...dogData } = request.body;

      // Create dog in database
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
          petfinderSyncStatus: autoUploadToPetfinder ? 'SYNCING' : 'NOT_SYNCED',
          petfinderErrors: [],
        },
      });

      let petfinderResult = null;

      if (autoUploadToPetfinder && petfinderUploadService) {
        try {
          const uploadResult = await petfinderUploadService.uploadDog(
            dog,
            'ftp'
          );

          if (uploadResult.success) {
            const updatedDog = await prisma.dog.update({
              where: { id: dog.id },
              data: {
                petfinderId: uploadResult.petfinderId || null,
                petfinderSyncStatus: 'SYNCED',
                petfinderLastSync: new Date(),
                petfinderErrors: [],
              },
            });

            petfinderResult = {
              success: true,
              method: uploadResult.method,
              message: uploadResult.message,
              petfinderId: uploadResult.petfinderId,
              manualUploadUrl: uploadResult.manualUploadUrl,
            };

            reply.code(201);
            return {
              data: updatedDog,
              message: uploadResult.message,
              petfinderResult,
            };
          } else {
            await prisma.dog.update({
              where: { id: dog.id },
              data: {
                petfinderSyncStatus: 'ERROR',
                petfinderErrors: [uploadResult.error || 'Unknown error'],
              },
            });

            petfinderResult = {
              success: false,
              error: uploadResult.error,
              message: uploadResult.message,
            };

            reply.code(201);
            return {
              data: dog,
              message: 'Dog created, but Petfinder upload failed',
              petfinderResult,
              warning: 'Petfinder upload failed - please check FTP credentials',
            };
          }
        } catch (err) {
          console.error('Petfinder upload error:', err);
          await prisma.dog.update({
            where: { id: dog.id },
            data: {
              petfinderSyncStatus: 'ERROR',
              petfinderErrors: [
                err instanceof Error ? err.message : 'Unknown error',
              ],
            },
          });

          petfinderResult = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
            message: 'Petfinder upload failed due to technical error',
          };

          reply.code(201);
          return {
            data: dog,
            message: 'Dog created, but Petfinder upload failed',
            petfinderResult,
            warning: 'Petfinder upload failed - please check FTP credentials',
          };
        }
      }

      // Creation without upload or when service not configured
      reply.code(201);
      if (autoUploadToPetfinder && !petfinderUploadService) {
        return {
          data: dog,
          message: 'Dog created successfully!',
          petfinderResult: {
            success: false,
            error: 'Petfinder service not configured',
            message: 'Configure FTP credentials to enable Petfinder upload',
          },
          warning: 'Petfinder credentials not configured',
        };
      }

      return { data: dog, message: 'Dog created successfully!' };
    } catch (error) {
      console.error('Error creating dog:', error);
      reply.code(500);
      return {
        error: 'Failed to create dog',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Get a specific dog
  fastify.get<{ Params: { id: string } }>(
    '/api/dogs/:id',
    async (request, reply) => {
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
        console.error('Error fetching dog:', error);
        reply.code(500);
        return { error: 'Failed to fetch dog' };
      }
    }
  );

  // Manually upload a dog to Petfinder via FTP
  fastify.post<{ Params: { id: string } }>(
    '/api/dogs/:id/upload-to-petfinder',
    async (request, reply) => {
      try {
        if (!petfinderUploadService) {
          reply.code(503);
          return {
            error: 'Petfinder service not configured',
            message: 'Please configure FTP credentials',
          };
        }

        const dog = await prisma.dog.findUnique({
          where: { id: request.params.id },
        });
        if (!dog) {
          reply.code(404);
          return { error: 'Dog not found' };
        }

        const uploadResult = await petfinderUploadService.uploadDog(dog, 'ftp');
        if (uploadResult.success) {
          const updatedDog = await prisma.dog.update({
            where: { id: dog.id },
            data: {
              petfinderId: uploadResult.petfinderId || null,
              petfinderSyncStatus: 'SYNCED',
              petfinderLastSync: new Date(),
              petfinderErrors: [],
            },
          });

          return {
            success: true,
            data: updatedDog,
            method: uploadResult.method,
            message: uploadResult.message,
            petfinderId: uploadResult.petfinderId,
            manualUploadUrl: uploadResult.manualUploadUrl,
          };
        } else {
          await prisma.dog.update({
            where: { id: dog.id },
            data: {
              petfinderSyncStatus: 'ERROR',
              petfinderErrors: [uploadResult.error || 'Unknown error'],
            },
          });

          reply.code(400);
          return {
            success: false,
            error: uploadResult.error,
            message: uploadResult.message,
          };
        }
      } catch (error) {
        console.error('Error uploading to Petfinder:', error);
        await prisma.dog.update({
          where: { id: request.params.id },
          data: {
            petfinderSyncStatus: 'ERROR',
            petfinderErrors: [
              error instanceof Error ? error.message : 'Unknown error',
            ],
          },
        });
        reply.code(500);
        return {
          success: false,
          error: 'Failed to upload to Petfinder',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  );

  // Test Petfinder connection
  fastify.get('/api/petfinder/test', async (request, reply) => {
    try {
      if (!petfinderImporter) {
        reply.code(400);
        return { error: 'Petfinder API not configured' };
      }

      const isConnected = await petfinderImporter.testConnection();

      return {
        connected: isConnected,
        message: isConnected
          ? 'Petfinder API connection successful'
          : 'Failed to connect to Petfinder API',
      };
    } catch (error) {
      console.error('Error testing Petfinder connection:', error);
      reply.code(500);
      return {
        error: 'Failed to test connection',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Import dogs from organization
  fastify.post<{ Body: { organizationId: string } }>(
    '/api/petfinder/import/organization',
    async (request, reply) => {
      try {
        if (!petfinderImporter) {
          reply.code(400);
          return { error: 'Petfinder API not configured' };
        }

        const { organizationId } = request.body;

        if (!organizationId) {
          reply.code(400);
          return { error: 'Organization ID is required' };
        }

        console.log(`Starting import for organization: ${organizationId}`);

        const result = await petfinderImporter.importFromOrganization(
          organizationId
        );

        return {
          success: true,
          message: `Import completed: ${result.imported} dogs imported, ${result.skipped} skipped`,
          ...result,
        };
      } catch (error) {
        console.error('Error importing from organization:', error);
        reply.code(500);
        return {
          error: 'Failed to import dogs',
          message: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }
  );

  // Import dogs from search criteria
  fastify.post<{
    Body: {
      location?: string;
      breed?: string;
      age?: string;
      size?: string;
      gender?: string;
      distance?: number;
    };
  }>('/api/petfinder/import/search', async (request, reply) => {
    try {
      if (!petfinderImporter) {
        reply.code(400);
        return { error: 'Petfinder API not configured' };
      }

      const searchParams = request.body;

      console.log('Starting import with search criteria:', searchParams);

      const result = await petfinderImporter.importFromSearch(searchParams);

      return {
        success: true,
        message: `Import completed: ${result.imported} dogs imported, ${result.skipped} skipped`,
        ...result,
      };
    } catch (error) {
      console.error('Error importing from search:', error);
      reply.code(500);
      return {
        error: 'Failed to import dogs',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  // Get import status/stats
  fastify.get('/api/petfinder/stats', async () => {
    try {
      const totalDogs = await prisma.dog.count();
      const petfinderDogs = await prisma.dog.count({
        where: { postedToPetfinder: true },
      });
      const localDogs = totalDogs - petfinderDogs;

      return {
        totalDogs,
        petfinderDogs,
        localDogs,
        petfinderPercentage:
          totalDogs > 0 ? Math.round((petfinderDogs / totalDogs) * 100) : 0,
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return {
        error: 'Failed to get stats',
        message: error instanceof Error ? error.message : 'Unknown error',
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
    console.log(
      '🐕 Petfinder integration:',
      petfinderUploadService
        ? '✅ Enabled (FTP only)'
        : '❌ Disabled (missing FTP credentials)'
    );
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
