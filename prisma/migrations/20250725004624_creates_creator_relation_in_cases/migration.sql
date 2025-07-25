/*
  Warnings:

  - You are about to drop the column `createdBy` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `cases` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `cases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_userId_fkey";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "createdBy",
DROP COLUMN "userId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "inChargeId" TEXT;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_inChargeId_fkey" FOREIGN KEY ("inChargeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
