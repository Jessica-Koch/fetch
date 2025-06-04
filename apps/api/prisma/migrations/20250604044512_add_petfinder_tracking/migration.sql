/*
  Warnings:

  - Added the required column `gender` to the `dogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `dogs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'XLARGE');

-- CreateEnum
CREATE TYPE "Coat" AS ENUM ('HAIRLESS', 'SHORT', 'MEDIUM', 'LONG', 'WIRE', 'CURLY');

-- AlterTable
ALTER TABLE "dogs" ADD COLUMN     "breedMixed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "breedSecondary" TEXT,
ADD COLUMN     "breedUnknown" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "coat" "Coat",
ADD COLUMN     "colorPrimary" TEXT,
ADD COLUMN     "colorSecondary" TEXT,
ADD COLUMN     "colorTertiary" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "declawed" BOOLEAN,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "goodWithCats" BOOLEAN,
ADD COLUMN     "goodWithChildren" BOOLEAN,
ADD COLUMN     "goodWithDogs" BOOLEAN,
ADD COLUMN     "houseTrained" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "petfinderErrors" TEXT[],
ADD COLUMN     "petfinderLastSync" TIMESTAMP(3),
ADD COLUMN     "petfinderSyncStatus" TEXT NOT NULL DEFAULT 'NOT_SYNCED',
ADD COLUMN     "shotsCurrent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "size" "Size" NOT NULL,
ADD COLUMN     "spayedNeutered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "specialNeeds" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "videos" TEXT[];
