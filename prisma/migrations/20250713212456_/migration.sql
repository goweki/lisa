/*
  Warnings:

  - A unique constraint covering the columns `[institutionId,userId,userRole]` on the table `institutionUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userRole` to the `institutionUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "institutionUsers_institutionId_userId_key";

-- AlterTable
ALTER TABLE "institutionUsers" ADD COLUMN     "userRole" "userRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "institutionUsers_institutionId_userId_userRole_key" ON "institutionUsers"("institutionId", "userId", "userRole");
