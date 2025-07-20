import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function deployMigrations() {
  try {
    console.log('Running Prisma migrations...');
    await execAsync('npx prisma migrate deploy');
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

deployMigrations();
