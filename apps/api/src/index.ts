import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Import your route handlers
import { applicationRoutes } from './routes/application.routes.js';
// Add other route imports here as needed

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    // Run database migrations on startup
    console.log('🔄 Running database migrations...');
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      await execAsync('npx prisma migrate deploy');
      console.log('✅ Database migrations completed successfully');
    } catch (migrationError) {
      console.error('❌ Migration failed:', migrationError);
      // Don't exit - try to continue, maybe tables already exist
    }

    // Register CORS with your Railway domains
    const allowedOrigins = [
      'http://localhost:5173', // Local development
      'https://web-production-58768.up.railway.app', // Your Railway web service
      /.*\.railway\.app$/, // Allow all Railway domains
    ];

    // Add FRONTEND_URL if it exists
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    await fastify.register(cors, {
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Register multipart for file uploads
    await fastify.register(multipart);

    // Health check endpoint
    fastify.get('/health', async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }));

    // Basic dogs endpoint for testing
    fastify.get('/dogs', async () => {
      try {
        const dogs = await prisma.dog.findMany({
          take: 20, // Limit to 20 dogs
          orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: dogs };
      } catch (error) {
        console.error('Error fetching dogs:', error);
        return { success: false, error: 'Failed to fetch dogs' };
      }
    });

    // Register application routes
    await fastify.register(applicationRoutes.bind(null, fastify, prisma));

    // Start the server
    const port = parseInt(process.env.PORT || '3001');
    const host = '0.0.0.0'; // Important for Railway deployment

    await fastify.listen({ port, host });
    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log('✅ Database connected');
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully');
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully');
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

start();
