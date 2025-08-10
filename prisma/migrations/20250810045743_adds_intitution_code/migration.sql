/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `institutions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "institutions_name_key";

-- AlterTable
ALTER TABLE "institutions" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "institutions_code_key" ON "institutions"("code");
