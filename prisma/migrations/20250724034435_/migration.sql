/*
  Warnings:

  - A unique constraint covering the columns `[tel]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VerificationChannel" AS ENUM ('EMAIL', 'WHATSAPP');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "telVerification" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "users_tel_key" ON "users"("tel");
