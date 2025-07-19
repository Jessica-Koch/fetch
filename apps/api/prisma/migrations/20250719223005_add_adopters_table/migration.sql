-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('MOBILE', 'HOME', 'WORK');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FOSTER', 'ADOPTER');

-- CreateTable
CREATE TABLE "adopters" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneType" "PhoneType" NOT NULL DEFAULT 'MOBILE',
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "socialMedia" TEXT,
    "age" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "lengthOfEmployment" TEXT NOT NULL,
    "applicationIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adopters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationReference" (
    "id" TEXT NOT NULL,
    "adopterId" TEXT NOT NULL,
    "mongoAppId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'FOSTER',
    "adopterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adopters_email_key" ON "adopters"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_adopterId_key" ON "User"("adopterId");

-- AddForeignKey
ALTER TABLE "ApplicationReference" ADD CONSTRAINT "ApplicationReference_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "adopters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adopterId_fkey" FOREIGN KEY ("adopterId") REFERENCES "adopters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
