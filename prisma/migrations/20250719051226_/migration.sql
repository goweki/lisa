/*
  Warnings:

  - The values [pending,approved,rejected] on the enum `AssigneeRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [open,closed] on the enum `CaseStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [draft,unpublished,published,archived] on the enum `ContentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [event,document] on the enum `TaskType` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,advocate,lawyer] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AssigneeRequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "assigneeRequests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "assigneeRequests" ALTER COLUMN "status" TYPE "AssigneeRequestStatus_new" USING ("status"::text::"AssigneeRequestStatus_new");
ALTER TYPE "AssigneeRequestStatus" RENAME TO "AssigneeRequestStatus_old";
ALTER TYPE "AssigneeRequestStatus_new" RENAME TO "AssigneeRequestStatus";
DROP TYPE "AssigneeRequestStatus_old";
ALTER TABLE "assigneeRequests" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CaseStatus_new" AS ENUM ('OPEN', 'CLOSED');
ALTER TABLE "cases" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "cases" ALTER COLUMN "status" TYPE "CaseStatus_new" USING ("status"::text::"CaseStatus_new");
ALTER TYPE "CaseStatus" RENAME TO "CaseStatus_old";
ALTER TYPE "CaseStatus_new" RENAME TO "CaseStatus";
DROP TYPE "CaseStatus_old";
ALTER TABLE "cases" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ContentStatus_new" AS ENUM ('DRAFT', 'UNPUBLISHED', 'PUBLISHED', 'ARCHIVED');
ALTER TABLE "Blog" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Blog" ALTER COLUMN "status" TYPE "ContentStatus_new" USING ("status"::text::"ContentStatus_new");
ALTER TYPE "ContentStatus" RENAME TO "ContentStatus_old";
ALTER TYPE "ContentStatus_new" RENAME TO "ContentStatus";
DROP TYPE "ContentStatus_old";
ALTER TABLE "Blog" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "TaskType_new" AS ENUM ('EVENT', 'DOCUMENT');
ALTER TABLE "tasks" ALTER COLUMN "type" TYPE "TaskType_new" USING ("type"::text::"TaskType_new");
ALTER TYPE "TaskType" RENAME TO "TaskType_old";
ALTER TYPE "TaskType_new" RENAME TO "TaskType";
DROP TYPE "TaskType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'ADVOCATE', 'LAWYER');
ALTER TABLE "institutionUsers" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "institutionUsers" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "institutionUsers" ALTER COLUMN "role" SET DEFAULT 'LAWYER';
COMMIT;

-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "assigneeRequests" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "institutionUsers" ALTER COLUMN "role" SET DEFAULT 'LAWYER';
