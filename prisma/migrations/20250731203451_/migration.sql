-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'WEB');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "channel" "MessageChannel" NOT NULL DEFAULT 'WHATSAPP',
ADD COLUMN     "direction" "MessageDirection" NOT NULL DEFAULT 'INBOUND',
ADD COLUMN     "sessionId" TEXT;
