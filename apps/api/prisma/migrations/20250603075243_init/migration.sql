-- CreateEnum
CREATE TYPE "DogStatus" AS ENUM ('AVAILABLE', 'PENDING', 'ADOPTED', 'HOLD', 'MEDICAL');

-- CreateEnum
CREATE TYPE "Placement" AS ENUM ('IN_FOSTER', 'BOARDING', 'FOSTER_TO_ADOPT');

-- CreateTable
CREATE TABLE "dogs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "description" TEXT,
    "status" "DogStatus" NOT NULL DEFAULT 'AVAILABLE',
    "placement" "Placement" NOT NULL DEFAULT 'IN_FOSTER',
    "photos" TEXT[],
    "petfinderId" TEXT,
    "postedToPetfinder" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dogs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dogs_petfinderId_key" ON "dogs"("petfinderId");
