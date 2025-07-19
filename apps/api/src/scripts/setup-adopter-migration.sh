
#!/bin/bash

# Run this in the apps/api directory to create the migration
cd apps/api

# Create and apply the migration
pnpm prisma migrate dev --name add_adopters_table

# Generate the updated Prisma client
pnpm prisma generate

# Optional: Open Prisma Studio to view the new table
# pnpm prisma studio