import Fastify from 'fastify';
import cors from '@fastify/cors';
import multpart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { applicationRoutes } from './routes/application.routes';
import * as dotenv

import { applicationRoutes } from './routes/application.routes';

dotenv.config();

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

const start = async () => {
    try {
        // Register CORS with Railway domains
        await fastify.register(cors, {
      origin: [
        'http://localhost:3000', // Local development
        'https://web-production-58768.up.railway.app', // Your Railway web service
        process.env.FRONTEND_URL, // Environment variable
        /.*\.railway\.app$/, // Allow all Railway domains
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
        });
        
        // Register multipart for file uploads
        await fastify.register(multpart);

        // Health check endpoint
        fastify.get('/dogs', async () => {
      try {
        const dogs = await prisma.dog.findMany({
          take: 20, // Limit to 20 dogs
          orderBy: { createdAt: 'desc' }
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