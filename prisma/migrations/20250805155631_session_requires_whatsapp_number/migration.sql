/*
  Warnings:

  - You are about to drop the column `phone` on the `sessions` table. All the data in the column will be lost.
  - Added the required column `whatsAppNumber` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "phone",
ADD COLUMN     "whatsAppNumber" TEXT NOT NULL;
