-- AlterEnum
ALTER TYPE "TaskType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
