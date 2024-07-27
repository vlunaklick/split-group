/*
  Warnings:

  - You are about to drop the column `due` on the `Spending` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Spending` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AlterTable
ALTER TABLE "Spending" DROP COLUMN "due",
DROP COLUMN "paid";
