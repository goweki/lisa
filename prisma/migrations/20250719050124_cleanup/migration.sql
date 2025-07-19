/*
  Warnings:

  - The `status` column on the `institutions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('ACTIVE', 'DORMANT', 'INACTIVE');

-- AlterTable
ALTER TABLE "institutions" DROP COLUMN "status",
ADD COLUMN     "status" "EntityStatus" NOT NULL DEFAULT 'DORMANT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "EntityStatus" NOT NULL DEFAULT 'DORMANT';

-- DropEnum
DROP TYPE "status";
