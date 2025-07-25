/*
  Warnings:

  - You are about to drop the column `inChargeId` on the `cases` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_inChargeId_fkey";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "inChargeId",
ADD COLUMN     "assigneeId" TEXT;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
