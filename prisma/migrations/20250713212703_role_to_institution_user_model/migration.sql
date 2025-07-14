/*
  Warnings:

  - You are about to drop the column `userRole` on the `institutionUsers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[institutionId,userId,role]` on the table `institutionUsers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `institutionUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "institutionUsers_institutionId_userId_userRole_key";

-- AlterTable
ALTER TABLE "institutionUsers" DROP COLUMN "userRole",
ADD COLUMN     "role" "userRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "institutionUsers_institutionId_userId_role_key" ON "institutionUsers"("institutionId", "userId", "role");
