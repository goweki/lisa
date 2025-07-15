/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[institutionId,userId]` on the table `institutionUsers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "institutionUsers_institutionId_userId_role_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role";

-- CreateIndex
CREATE UNIQUE INDEX "institutionUsers_institutionId_userId_key" ON "institutionUsers"("institutionId", "userId");
