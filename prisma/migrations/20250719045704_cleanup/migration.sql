/*
  Warnings:

  - You are about to drop the column `clientId` on the `cases` table. All the data in the column will be lost.
  - The `status` column on the `institutions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('ACTIVE', 'DORMANT', 'INACTIVE');

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "clientId",
ADD COLUMN     "clientID" TEXT;

-- AlterTable
ALTER TABLE "institutions" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'DORMANT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'DORMANT';

-- DropEnum
DROP TYPE "Status";
