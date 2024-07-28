/*
  Warnings:

  - Added the required column `creditorId` to the `Involved` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Involved" ADD COLUMN     "creditorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Involved" ADD CONSTRAINT "Involved_creditorId_fkey" FOREIGN KEY ("creditorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
