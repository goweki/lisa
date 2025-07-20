/*
  Warnings:

  - Changed the type of `name` on the `plans` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PlanName" AS ENUM ('starter', 'team', 'enterprise');

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "name",
ADD COLUMN     "name" "PlanName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");
