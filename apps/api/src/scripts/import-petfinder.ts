import { PrismaClient } from '@prisma/client';
import { createPetfinderImporter } from '../services/petfinder-importer';
import * as dotenv from 'dotenv';
import { create } from 'domain';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const main = async () => {
  console.log('🐕 Petfinder Dog Importer');
  console.log('========================');

  // Check for required environment variables
  if (!process.env.PETFINDER_API_KEY || !process.env.PETFINDER_SECRET) {
    console.error('❌ Missing required environment variables:');
    console.error('   PETFINDER_API_KEY');
    console.error('   PETFINDER_SECRET');
    console.error('');
    console.error('Add these to your .env file and try again.');
    process.exit(1);
  }

  const importer = createPetfinderImporter(
    {
      clientId: process.env.PETFINDER_API_KEY,
      clientSecret: process.env.PETFINDER_SECRET,
    },
    prisma
  );

  console.log('🔍 Testing Petfinder API connection...');
  const isConnected = await importer.testConnection();

  if (!isConnected) {
    console.error('❌ Failed to connect to Petfinder API');
    console.error('   Check your API key and secret');
    process.exit(1);
  }
  console.log('✅ Connected to Petfinder API');
  console.log('');

  // Get command line arguments
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log('Usage:');
    console.log('  pnpm run import-petfinder org <organization-id>');
    console.log('  pnpm run import-petfinder search <location>');
    console.log('  pnpm run import-petfinder stats');
    console.log('');
    console.log('Examples:');
    console.log('  pnpm run import-petfinder org CA2350');
    console.log('  pnpm run import-petfinder search "90210"');
    console.log('  pnpm run import-petfinder search "Los Angeles, CA"');
    process.exit(1);
  }
  try {
    switch (command) {
      case 'org':
      case 'organization': {
        const orgId = args[1];
        if (!orgId) {
          console.error('❌ Organization ID is required');
          console.error(
            'Usage: pnpm run import-petfinder org <organization-id>'
          );
          process.exit(1);
        }

        console.log(`📥 Importing dogs from organization: ${orgId}`);
        const result = await importer.importFromOrganization(orgId);

        console.log('');
        console.log('📊 Import Results:');
        console.log(`   ✅ Imported: ${result.imported} dogs`);
        console.log(`   ⏭️  Skipped: ${result.skipped} dogs (already exist)`);
        console.log(`   ❌ Errors: ${result.errors.length}`);

        if (result.errors.length > 0) {
          console.log('');
          console.log('❌ Errors encountered:');
          result.errors.forEach((error) => console.log(`   ${error}`));
        }
        break;
      }

      case 'search': {
        const location = args[1];
        if (!location) {
          console.error('❌ Location is required');
          console.error('Usage: pnpm run import-petfinder search <location>');
          console.error('Examples: "90210", "Los Angeles, CA", "New York, NY"');
          process.exit(1);
        }

        console.log(`📥 Importing dogs from location: ${location}`);
        const result = await importer.importFromSearch({ location });

        console.log('');
        console.log('📊 Import Results:');
        console.log(`   ✅ Imported: ${result.imported} dogs`);
        console.log(`   ⏭️  Skipped: ${result.skipped} dogs (already exist)`);
        console.log(`   ❌ Errors: ${result.errors.length}`);

        if (result.errors.length > 0) {
          console.log('');
          console.log('❌ Errors encountered:');
          result.errors.forEach((error) => console.log(`   ${error}`));
        }
        break;
      }

      case 'stats': {
        console.log('📊 Getting database statistics...');

        const totalDogs = await prisma.dog.count();
        const petfinderDogs = await prisma.dog.count({
          where: { postedToPetfinder: true },
        });
        const localDogs = totalDogs - petfinderDogs;

        console.log('');
        console.log('📈 Database Statistics:');
        console.log(`   🐕 Total dogs: ${totalDogs}`);
        console.log(`   🌐 From Petfinder: ${petfinderDogs}`);
        console.log(`   🏠 Local dogs: ${localDogs}`);

        if (totalDogs > 0) {
          const percentage = Math.round((petfinderDogs / totalDogs) * 100);
          console.log(`   📊 Petfinder percentage: ${percentage}%`);
        }
        break;
      }

      default: {
        console.error(`❌ Unknown command: ${command}`);
        console.error('Available commands: org, search, stats');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('');
    console.error('❌ Import failed:');
    console.error(
      `   ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  console.log('');
  console.log('✅ Import completed successfully!');
};

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
