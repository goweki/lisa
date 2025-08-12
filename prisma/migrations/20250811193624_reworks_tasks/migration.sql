/*
  Warnings:

  - You are about to drop the `assigneeRequests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `institutionUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assigneeRequests" DROP CONSTRAINT "assigneeRequests_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "assigneeRequests" DROP CONSTRAINT "assigneeRequests_caseId_fkey";

-- DropForeignKey
ALTER TABLE "institutionUsers" DROP CONSTRAINT "institutionUsers_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "institutionUsers" DROP CONSTRAINT "institutionUsers_userId_fkey";

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "assigneeId" TEXT,
ALTER COLUMN "caseId" DROP NOT NULL;

-- DropTable
DROP TABLE "assigneeRequests";

-- DropTable
DROP TABLE "institutionUsers";

-- CreateTable
CREATE TABLE "InstitutionUser" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'LAWYER',

    CONSTRAINT "InstitutionUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment-requests" (
    "id" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "caseId" TEXT,
    "taskId" TEXT,
    "status" "AssigneeRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assignment-requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionUser_institutionId_userId_key" ON "InstitutionUser"("institutionId", "userId");

-- AddForeignKey
ALTER TABLE "InstitutionUser" ADD CONSTRAINT "InstitutionUser_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionUser" ADD CONSTRAINT "InstitutionUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment-requests" ADD CONSTRAINT "assignment-requests_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment-requests" ADD CONSTRAINT "assignment-requests_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment-requests" ADD CONSTRAINT "assignment-requests_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
