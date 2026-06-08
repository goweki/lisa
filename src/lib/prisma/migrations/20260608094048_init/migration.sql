/*
  Warnings:

  - The `resetTokenSentTo` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'SMS');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "resetTokenSentTo",
ADD COLUMN     "resetTokenSentTo" "NotificationChannel";

-- DropEnum
DROP TYPE "VerificationChannel";
