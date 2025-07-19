/*
  Warnings:

  - The `status` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `assigneeID` on the `assigneeRequests` table. All the data in the column will be lost.
  - You are about to drop the column `caseID` on the `assigneeRequests` table. All the data in the column will be lost.
  - The `status` column on the `assigneeRequests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `caseTypeID` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `clientID` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `institutionID` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `cases` table. All the data in the column will be lost.
  - The `status` column on the `cases` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `taskID` on the `documents` table. All the data in the column will be lost.
  - The `role` column on the `institutionUsers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `institutions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `caseID` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `completedByID` on the `tasks` table. All the data in the column will be lost.
  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `regime` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `channel` on the `Reminder` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `assigneeId` to the `assigneeRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseId` to the `assigneeRequests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseTypeId` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionId` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `documents` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseId` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'DORMANT', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'advocate', 'lawyer');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('open', 'closed');

-- CreateEnum
CREATE TYPE "AssigneeRequestStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ReminderChannels" AS ENUM ('email', 'sms', 'whatsapp');

-- CreateEnum
CREATE TYPE "TimeRegimes" AS ENUM ('minutes', 'hours', 'days');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('event', 'document');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('draft', 'unpublished', 'published', 'archived');

-- DropForeignKey
ALTER TABLE "assigneeRequests" DROP CONSTRAINT "assigneeRequests_assigneeID_fkey";

-- DropForeignKey
ALTER TABLE "assigneeRequests" DROP CONSTRAINT "assigneeRequests_caseID_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_caseTypeID_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_institutionID_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_userID_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_taskID_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_caseID_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_completedByID_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "status",
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "regime",
ADD COLUMN     "regime" "TimeRegimes" NOT NULL,
DROP COLUMN "channel",
ADD COLUMN     "channel" "ReminderChannels" NOT NULL;

-- AlterTable
ALTER TABLE "assigneeRequests" DROP COLUMN "assigneeID",
DROP COLUMN "caseID",
ADD COLUMN     "assigneeId" TEXT NOT NULL,
ADD COLUMN     "caseId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "AssigneeRequestStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "caseTypeID",
DROP COLUMN "clientID",
DROP COLUMN "institutionID",
DROP COLUMN "userID",
ADD COLUMN     "caseTypeId" TEXT NOT NULL,
ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "institutionId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "CaseStatus" NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "taskID",
ADD COLUMN     "taskId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "institutionUsers" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'lawyer';

-- AlterTable
ALTER TABLE "institutions" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DORMANT';

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "caseID",
DROP COLUMN "completedByID",
ADD COLUMN     "caseId" TEXT NOT NULL,
ADD COLUMN     "completedById" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "TaskType" NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'DORMANT';

-- DropEnum
DROP TYPE "assigneeRequestStatus";

-- DropEnum
DROP TYPE "caseStatus";

-- DropEnum
DROP TYPE "contentStatus";

-- DropEnum
DROP TYPE "reminderChannels";

-- DropEnum
DROP TYPE "status";

-- DropEnum
DROP TYPE "taskType";

-- DropEnum
DROP TYPE "timeRegimes";

-- DropEnum
DROP TYPE "userRole";

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_caseTypeId_fkey" FOREIGN KEY ("caseTypeId") REFERENCES "caseTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigneeRequests" ADD CONSTRAINT "assigneeRequests_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assigneeRequests" ADD CONSTRAINT "assigneeRequests_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
