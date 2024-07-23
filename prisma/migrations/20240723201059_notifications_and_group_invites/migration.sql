-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GENERIC', 'GROUP_INVITE');

-- AlterTable
ALTER TABLE "GroupInvite" ADD COLUMN     "maxUses" INTEGER,
ADD COLUMN     "uses" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "acepted" BOOLEAN,
ADD COLUMN     "groupId" TEXT,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
