/*
  Warnings:

  - Made the column `code` on table `institutions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "institutions" ALTER COLUMN "code" SET NOT NULL;
