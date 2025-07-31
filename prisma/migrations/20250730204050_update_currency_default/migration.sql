/*
  Warnings:

  - The `currency` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('KSH');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'KSH';
