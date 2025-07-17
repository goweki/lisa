/*
  Warnings:

  - The values [system_admin] on the enum `userRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "userRole_new" AS ENUM ('admin', 'advocate', 'lawyer');
ALTER TABLE "institutionUsers" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "institutionUsers" ALTER COLUMN "role" TYPE "userRole_new" USING ("role"::text::"userRole_new");
ALTER TYPE "userRole" RENAME TO "userRole_old";
ALTER TYPE "userRole_new" RENAME TO "userRole";
DROP TYPE "userRole_old";
ALTER TABLE "institutionUsers" ALTER COLUMN "role" SET DEFAULT 'lawyer';
COMMIT;
